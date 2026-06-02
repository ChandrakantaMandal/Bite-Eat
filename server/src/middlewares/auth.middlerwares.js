const foodPartnerModel = require("../models/foodpartner.modle.js");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model.js");

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Unauthorized",
    });
  const isBlacklisted = await BlacklistToken.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.userId);

    if (!foodPartner) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Unauthorized",
    });

  const isBlacklisted = await BlacklistToken.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};
