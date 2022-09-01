const authRoute = require("express").Router();
const { registerUser, loginUser } = require("../controllers/auth.controller");

//  register route
authRoute.post("/register", async (req, res) => {
  let { message, status } = await registerUser(req.body);
  if (status === "Error") return res.status(501).send(message);
  res.status(200).send(message);
});

// login route
authRoute.post("/login", async (req, res) => {
  let response = await loginUser(req.body);

  if (response.status === "Error")
    return res.status(500).send(response.message);
  delete response.status;
  res.status(200).json(response);
});

module.exports = authRoute;
