const express = require("express");
const {
  createFood,
  getFoodItems,
  toggleFoodLike,
  toggleFoodSave,
  getSavedFoods,
  getFoodPartnerProfile,
} = require("../controllers/food.controllers.js");
const {
  authFoodPartnerMiddleware,
  authUserMiddleware,
} = require("../middlewares/auth.middlerwares.js");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/", authFoodPartnerMiddleware, upload.single("video"), createFood);
router.get("/", authUserMiddleware, getFoodItems);
router.post("/like", authUserMiddleware, toggleFoodLike);
router.get("/save", authUserMiddleware, getSavedFoods);
router.post("/save", authUserMiddleware, toggleFoodSave);
router.get("/partner/:id", getFoodPartnerProfile);

module.exports = router;
