const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route");
const blogRoute = require("./routes/blogs.route");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoute);
app.use("/blogs", blogRoute);
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Database is connected");
});
app.get("/", (req, res) => {
  res.send("App is Working.");
});

app.listen(process.env.PORT || 6500, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
