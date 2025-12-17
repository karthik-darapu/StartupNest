
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateToken } = require("../authUtils");
const Messages = require("./ControllerStaticMessages");

// Signup Controller
const addUser = async (req, res) => {
  try {
    const { userName, email, mobile, password, role } = req.body;

    // Validate input
    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: Messages.ERROR_MISSING_FIELDS });
    }

    // Check if user already exists (by email or mobile)
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      const existingField = existingUser.email === email ? "email" : "mobile number";
      return res
        .status(400)
        .json({ message: Messages.ERROR_USER_EXISTS.replace("${field}", existingField) });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const created = await User.create({
      userName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: Messages.SUCCESS_USER_REGISTERED,
      data: {
        userName: created.userName,
        email: created.email,
        role: created.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle Mongo duplicate key error (index conflicts)
    if (error.code === 11000) {
      const key = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: Messages.ERROR_DUPLICATE_KEY.replace("${key}", key),
      });
    }

    return res.status(500).json({
      success: false,
      message: Messages.ERROR_SIGNUP,
    });
  }
};

// Login Controller
const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: Messages.ERROR_EMAIL_PASSWORD_REQUIRED });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: Messages.ERROR_USER_NOT_FOUND });

    // Compare passwords
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: Messages.ERROR_INVALID_CREDENTIALS });
    }

    const token = generateToken(user._id, user.userName, user.role);

    return res.status(200).json({
      success: true,
      message: Messages.SUCCESS_LOGIN,
      token,
      userName: user.userName,
      role: user.role,
      id: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: Messages.ERROR_LOGIN,
    });
  }
};

module.exports = {
  addUser,
  getUserByEmailAndPassword,
};