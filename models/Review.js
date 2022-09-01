const mongoose = require("mongoose");

// I added blogId in this schema because with the help of this blogId we will fetch all reviews for a specific blog.
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
