import axios from "axios";
import FormData from "form-data";
import { User } from "../models/userModel.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?._id;

    if (!userId || !prompt) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credit balance",
        creditBalance: user.creditBalance,
      });
    }

    // Prepare form-data for Stability API
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png"); // Optional: png, jpg, webp
    formData.append("width", 512);
    formData.append("height", 512);

    const { data } = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json"
        },
        responseType: "json"
      }
    );

    if (!data.image) {
      return res.status(500).json({ success: false, message: "Image generation failed" });
    }

    // Convert Base64 to Data URI
    const resultImage = `data:image/png;base64,${data.image}`;

    // Deduct credit
    user.creditBalance -= 1;
    await user.save();

    return res.json({
      success: true,
      message: "Image generated",
      creditBalance: user.creditBalance,
      resultImage,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
