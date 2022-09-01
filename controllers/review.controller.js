const Review = require("../models/Review");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// create a review
async function createReview(request) {
  if (!request.body.description)
    return { message: "Description should not be blank.", status: "Error" };
  let token = request.headers["authorization"]?.split(" ")[1];
  let userDetails;
  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return {
      message: "You have to log in first to post a review.",
      status: "Error",
    };
  }
  try {
    let review = await Review.create({
      ...request.body,
      blogId: request.params.blogId,
      userId: userDetails.id,
    });
    return {
      message: "You have added a review on this blog.",
      review,
      status: "Success",
    };
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

// delete a review
async function deleteReview(request) {
  let token = request.headers["authorization"]?.split(" ")[1];
  let userDetails;
  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return {
      message: "You have to log in first to delete the review.",
      status: "Error",
    };
  }
  try {
    let review = await Review.findOne({ _id: request.body.reviewId });
    if (review.userId === userDetails.id) {
      await review.deleteOne();
      return {
        message: "Review has been deleted successfully.",
        status: "Success",
      };
    } else {
      return {
        message: "you can delete your blog only.",
        status: "Error",
      };
    }
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

module.exports = { createReview, deleteReview };
