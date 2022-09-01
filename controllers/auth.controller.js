const User = require("../models/User");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let emailPattern = /^\S+@\S+\.\S+$/;
let passwordPattern = /^(?=.{6,}).*$/;

// register controller
async function registerUser(user) {
  try {
    if (!user) {
      return { message: "User data is incorrect", status: "Error" };
    }
    if (!user.name) {
      return { message: "Name is required", status: "Error" };
    }

    if (!user.email) {
      return { message: "Email is required", status: "Error" };
    } else {
      let isValidEmail = user.email.match(emailPattern);
      if (!isValidEmail) {
        return { message: "Enter a valid email.", status: "Error" };
      }

      let isEmailExists = await User.findOne({ email: user.email });
      if (isEmailExists) {
        return {
          message: "Email is already registered.",
          status: "Error",
        };
      }
    }
    if (!user.password) {
      return { message: "password is required", status: "Error" };
    } else {
      let isPasswordCorrect = user.password.match(passwordPattern);
      // I stored the hash password in the database with the help of bcryptjs.
      if (isPasswordCorrect) {
        user.password = bcrypt.hashSync(user.password, 10);
      } else {
        return { message: "password is not correct.", status: "Error" };
      }
    }

    await User.create(user);
    return {
      message: "Account created successfully.",
      status: "Success",
    };
  } catch (error) {
    return { message: "Internal server Error", status: "Error" };
  }
}

// login controller
async function loginUser({ email, password }) {
  if (!email) return { message: "email should not be blank.", status: "Error" };
  if (!password)
    return { message: "password should not be blank.", status: "Error" };
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return { message: "User not found.", status: "Error" };
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { message: "Password is incorrect", status: "Error" };
    }

    // I generated a token for the user after login with the help of this token we will check is the user authorized for private routes or not.
    let token = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    return {
      status: "Success",
      message: "Logged in successfully",
      data: user,
      token,
    };
  } catch (error) {
    return { message: "Internal server error", status: "Error" };
  }
}

module.exports = { registerUser, loginUser };
