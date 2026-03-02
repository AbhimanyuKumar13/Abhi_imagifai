import axios from "axios";
import { User } from "../models/userModel.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?._id;

    if (!userId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!process.env.POLLINATIONS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service not configured",
      });
    }

    const encodedPrompt = encodeURIComponent(prompt);

    const response = await axios.get(
      `https://gen.pollinations.ai/image/${encodedPrompt}?width=512&height=512`,
      {
        headers: {
          Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
        },
        responseType: "arraybuffer",
        timeout: 30000,
      }
    );

    if (response.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Image generation failed",
      });
    }

    const base64Image = Buffer.from(response.data).toString("base64");
    const resultImage = `data:image/jpeg;base64,${base64Image}`;

    // Deduct credit ONLY after successful generation
    user.creditBalance -= 1;
    await user.save();

    return res.json({
      success: true,
      message: "Image generated",
      creditBalance: user.creditBalance,
      resultImage,
    });

  } catch (error) {
    console.error("Pollinations Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};