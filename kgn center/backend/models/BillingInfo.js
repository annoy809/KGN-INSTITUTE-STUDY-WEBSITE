import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String,
  email: String,
  phone: String,
  country: String,
  state: String,
  city: String,
  address: String,
  pincode: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("BillingInfo", billingSchema);
