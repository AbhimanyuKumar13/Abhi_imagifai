import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  credits: { type: Number, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const transactionModel =
  mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default transactionModel;
