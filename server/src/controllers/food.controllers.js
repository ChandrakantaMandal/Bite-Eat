const mongoose = require("mongoose");
const foodModel = require("../models/food.model.js");
const foodPartnerModel = require("../models/foodpartner.modle.js");
const { uploadFile } = require("../services/storage.services.js");
const { v4: uuid } = require("uuid");

function hasObjectId(items = [], id) {
  const targetId = id?.toString();
  return items.some((itemId) => itemId.toString() === targetId);
}

function removeObjectId(items = [], id) {
  const targetId = id?.toString();
  return items.filter((itemId) => itemId.toString() !== targetId);
}

function serializeFoodItem(food, userId) {
  const likedBy = food.likedBy ?? [];
  const savedBy = food.savedBy ?? [];
  const foodPartnerId =
    food.foodPartner &&
    typeof food.foodPartner === "object" &&
    "_id" in food.foodPartner
      ? food.foodPartner._id
      : food.foodPartner;

  return {
    _id: food._id,
    name: food.name,
    description: food.description,
    video: food.video,
    foodPartner: foodPartnerId,
    likeCount: likedBy.length,
    savesCount: savedBy.length,
    commentsCount: 0,
    liked: userId ? hasObjectId(likedBy, userId) : false,
    saved: userId ? hasObjectId(savedBy, userId) : false,
  };
}

async function createFood(req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: "Video file is required",
    });
  }

  const fileUploadResult = await uploadFile(req, req.file.buffer, uuid());

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "Food item created successfully",
    food: serializeFoodItem(foodItem),
  });
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({}).sort({ _id: -1 });

  res.status(200).json({
    message: "Food items retrieved successfully",
    foodItems: foodItems.map((foodItem) =>
      serializeFoodItem(foodItem, req.user._id),
    ),
  });
}

async function toggleFoodLike(req, res) {
  const { foodId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({
      message: "Invalid food item",
    });
  }

  const foodItem = await foodModel.findById(foodId);
  if (!foodItem) {
    return res.status(404).json({
      message: "Food item not found",
    });
  }

  const isLiked = hasObjectId(foodItem.likedBy, req.user._id);
  foodItem.likedBy = isLiked
    ? removeObjectId(foodItem.likedBy, req.user._id)
    : [req.user._id, ...foodItem.likedBy];

  await foodItem.save();

  res.status(200).json({
    message: isLiked ? "Food unliked successfully" : "Food liked successfully",
    like: !isLiked,
    food: serializeFoodItem(foodItem, req.user._id),
  });
}

async function toggleFoodSave(req, res) {
  const { foodId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({
      message: "Invalid food item",
    });
  }

  const foodItem = await foodModel.findById(foodId);
  if (!foodItem) {
    return res.status(404).json({
      message: "Food item not found",
    });
  }

  const isSaved = hasObjectId(foodItem.savedBy, req.user._id);
  foodItem.savedBy = isSaved
    ? removeObjectId(foodItem.savedBy, req.user._id)
    : [req.user._id, ...foodItem.savedBy];

  await foodItem.save();

  res.status(200).json({
    message: isSaved ? "Food unsaved successfully" : "Food saved successfully",
    save: !isSaved,
    food: serializeFoodItem(foodItem, req.user._id),
  });
}

async function getSavedFoods(req, res) {
  const savedFoods = await foodModel
    .find({ savedBy: req.user._id })
    .sort({ _id: -1 });

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods: savedFoods.map((foodItem) => ({
      food: serializeFoodItem(foodItem, req.user._id),
    })),
  });
}

async function getFoodPartnerProfile(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid food partner",
    });
  }

  const [foodPartner, foodItems] = await Promise.all([
    foodPartnerModel.findById(id),
    foodModel.find({ foodPartner: id }).sort({ _id: -1 }),
  ]);

  if (!foodPartner) {
    return res.status(404).json({
      message: "Food partner not found",
    });
  }

  const customersServed = new Set(
    foodItems.flatMap((foodItem) =>
      (foodItem.savedBy ?? []).map((userId) => userId.toString()),
    ),
  );
  const serializedFoodItems = foodItems.map((foodItem) =>
    serializeFoodItem(foodItem),
  );

  res.status(200).json({
    message: "Food partner profile retrieved successfully",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      address: foodPartner.address,
      contactName: foodPartner.contactName,
      phoneNumber: foodPartner.phoneNumber,
      totalMeals: serializedFoodItems.length,
      customersServed: customersServed.size,
      foodItems: serializedFoodItems,
    },
  });
}

module.exports = {
  createFood,
  getFoodItems,
  toggleFoodLike,
  toggleFoodSave,
  getSavedFoods,
  getFoodPartnerProfile,
};
