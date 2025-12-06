import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
  },
  { 
    timestamps: true, // automatically adds createdAt and updatedAt
    versionKey: false // optional: removes __v field
  }
);

// Ensure a user cannot add the same course twice
wishlistSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Optional: virtual field to easily access course details (if populated)
wishlistSchema.virtual("courseDetails", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
  justOne: true,
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
