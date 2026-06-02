const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getCurrentFoodPartner,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
} = require("../controllers/auth.controller");
const {
  authUserMiddleware,
  authFoodPartnerMiddleware,
} = require("../middlewares/auth.middlerwares.js");

const router = express.Router();

//user auth api
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);
router.get("/user/me", authUserMiddleware, getCurrentUser);

//food partner auth api
router.post("/food-partner/register", registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);
router.get(
  "/food-partner/me",
  authFoodPartnerMiddleware,
  getCurrentFoodPartner,
);

module.exports = router;
