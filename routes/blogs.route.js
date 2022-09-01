const blogRoute = require("express").Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");
const {
  createReview,
  deleteReview,
} = require("../controllers/review.controller");

//  get all blogs
blogRoute.get("/", async (req, res) => {
  let blogs = await getBlogs();
  if (blogs.status === "Error") return res.status(500).json(blogs.message);
  return res.status(200).json(blogs.blogs);
});

//  get single blog
blogRoute.get("/:blogId", async (req, res) => {
  let blog = await getBlog(req.params.blogId);
  if (blog.status === "Error") return res.status(500).json(blog.message);
  return res.status(200).json(blog.blog);
});

// create a blog
blogRoute.post("/create", async (req, res) => {
  let blog = await createBlog(req);
  if (blog.status === "Error") return res.status(500).json(blog.message);
  return res.status(201).json(blog.message);
});

// update a blog
blogRoute.patch("/:blogId/update", async (req, res) => {
  let blog = await updateBlog(req);
  if (blog.status === "Error") return res.status(401).json(blog.message);
  return res.status(200).json(blog.message);
});

// delete a blog
blogRoute.delete("/:blogId/delete", async (req, res) => {
  let blog = await deleteBlog(req);
  if (blog.status === "Error") return res.status(401).json(blog.message);
  return res.status(204).json(blog.message);
});

// create a review
blogRoute.post("/:blogId/addreview", async (req, res) => {
  let review = await createReview(req);
  if (review.status === "Error") return res.status(401).json(review.message);
  delete review.status;
  return res.status(201).json(review);
});

// delete a review
blogRoute.delete("/:blogId/deletereview", async (req, res) => {
  let review = await deleteReview(req);
  if (review.status === "Error") return res.status(401).json(review.message);
  return res.status(204).json(review.message);
});

module.exports = blogRoute;
