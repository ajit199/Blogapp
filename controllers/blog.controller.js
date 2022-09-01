const Blog = require("../models/Blog");
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// get all blogs
async function getBlogs() {
  try {
    let blogs = await Blog.find();
    return { blogs, status: "Success" };
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

// get single blog
async function getBlog(blogId) {
  try {
    let blog = await Blog.findOne({ _id: blogId });
    return { blog, status: "Success" };
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

// create a blog
async function createBlog(request) {
  if (!request.body.title)
    return { message: "title should not be blank.", status: "Error" };
  if (!request.body.body)
    return { message: "body should not be blank.", status: "Error" };
  // let token = request.headers["authorization"]?.split(" ")[1];
  // let userDetails;
  // try {
  //   userDetails = jwt.verify(token, process.env.SECRET_KEY);
  // } catch (error) {
  //   return {
  //     message: "You have to log in first to create a blog.",
  //     status: "Error",
  //   };
  // }
  let { message, userDetails, status } = isValidToken(request);
  if (status === "Error") {
    return { message, status };
  }
  try {
    await Blog.create({ ...request.body, userId: userDetails.id });
    return {
      message: "Blog has been created successfully.",
      status: "Success",
    };
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

// update a blog
async function updateBlog(request) {
  // await post.updateOne({ $set: req.body });
  let { message, userDetails, status } = isValidToken(request);
  if (status === "Error") {
    return { message, status };
  }
  try {
    let blog = await Blog.findOne({ _id: request.params.blogId });
    if (blog.userId === userDetails.id) {
      await blog.updateOne({ $set: request.body });
      return {
        message: "Blog has been updated successfully.",
        status: "Success",
      };
    } else {
      return {
        message: "you can update your blog only.",
        status: "Error",
      };
    }
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

// delete a blog
async function deleteBlog(request) {
  let { message, userDetails, status } = isValidToken(request);
  if (status === "Error") {
    return { message, status };
  }
  try {
    let blog = await Blog.findOne({ _id: request.params.blogId });
    if (blog.userId === userDetails.id) {
      await blog.deleteOne();
      return {
        message: "Blog has been deleted successfully.",
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

// create a review
async function createReview(request) {
  if (!request.body.description)
    return { message: "Description should not be blank.", status: "Error" };
  let { message, userDetails, status } = isValidToken(request);
  if (status === "Error") {
    return { message, status };
  }
  try {
    let review = await Review.create({
      ...request.body,
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
  let { message, userDetails, status } = isValidToken(request);
  if (status === "Error") {
    return { message, status };
  }
  try {
    let review = await Review.findOne({ _id: request.params.reviewId });
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

function isValidToken(request) {
  let token = request.headers["authorization"]?.split(" ")[1];
  let userDetails;
  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
    return {
      userDetails,
      status: "Success",
    };
  } catch (error) {
    return {
      message: "You have to log in first to create a blog.",
      status: "Error",
    };
  }
}

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  createReview,
  deleteReview,
};
