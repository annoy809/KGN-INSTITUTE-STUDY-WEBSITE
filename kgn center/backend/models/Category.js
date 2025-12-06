import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  icon: { type: String, default: "fa-layer-group" }
});

export default mongoose.model("Category", CategorySchema);
