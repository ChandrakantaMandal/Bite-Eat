const userModel = require("../models/user.model.js");
const foodPartnerModel = require("../models/foodpartner.modle.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model.js");

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!fullName?.trim() || !normalizedEmail || !password) {
    return res.status(400).json({
      message: "Full name, email, and password are required",
    });
  }

  const isUserAlradyExists = await userModel.findOne({
    email: normalizedEmail,
  });
  if (isUserAlradyExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await userModel.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User Login successful",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await BlacklistToken.create({ token });
    res.status(200).json({
      message: "User logged out successfully",
    });
    return;
  }
}

async function getCurrentUser(req, res) {
  res.status(200).json({
    message: "Authenticated user retrieved successfully",
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    },
  });
}

async function getCurrentFoodPartner(req, res) {
  res.status(200).json({
    message: "Authenticated food partner retrieved successfully",
    foodPartner: {
      _id: req.foodPartner._id,
      name: req.foodPartner.name,
      email: req.foodPartner.email,
      phoneNumber: req.foodPartner.phoneNumber,
      address: req.foodPartner.address,
      contactName: req.foodPartner.contactName,
    },
  });
}

async function registerFoodPartner(req, res) {
  const {
    name,
    fullName,
    email,
    password,
    phone,
    phoneNumber,
    address,
    contactName,
  } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const partnerName = (name || fullName || "").trim();
  const partnerPhone = (phoneNumber || phone || "").trim();

  if (
    !partnerName ||
    !contactName?.trim() ||
    !partnerPhone ||
    !address?.trim() ||
    !normalizedEmail ||
    !password
  ) {
    return res.status(400).json({
      message:
        "Business name, contact name, phone, address, email, and password are required",
    });
  }

  const [existingUser, existingFoodPartner] = await Promise.all([
    userModel.findOne({ email: normalizedEmail }),
    foodPartnerModel.findOne({ email: normalizedEmail }),
  ]);

  if (existingUser || existingFoodPartner) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name: partnerName,
    email: normalizedEmail,
    password: hashedPassword,
    phoneNumber: partnerPhone,
    address: address.trim(),
    contactName: contactName.trim(),
  });

  const token = jwt.sign({ userId: foodPartner._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "Food partner created successfully",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
      phoneNumber: foodPartner.phoneNumber,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const foodPartner = await foodPartnerModel.findOne({
    email: normalizedEmail,
  });
  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: foodPartner._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "Food partner login successful",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
      phoneNumber: foodPartner.phoneNumber,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
    },
  });
}

async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await BlacklistToken.create({ token });
    res.status(200).json({
      message: "Food partner logged out successfully",
    });
    return;
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getCurrentFoodPartner,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
