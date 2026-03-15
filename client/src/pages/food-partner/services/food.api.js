import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

export async function fetchFeedItems() {
  try {
    const response = await api.get("/api/food");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to load food items"));
  }
}

export async function toggleFoodLike(foodId) {
  try {
    const response = await api.post("/api/food/like", { foodId });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to update like"));
  }
}

export async function toggleFoodSave(foodId) {
  try {
    const response = await api.post("/api/food/save", { foodId });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to update save"));
  }
}

export async function fetchSavedFoods() {
  try {
    const response = await api.get("/api/food/save");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to load saved foods"));
  }
}

export async function createFoodItem({ name, description, videoFile }) {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", videoFile);

    const response = await api.post("/api/food", formData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to create food item"));
  }
}

export async function fetchFoodPartnerProfile(id) {
  try {
    const response = await api.get(`/api/food/partner/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to load food partner profile"));
  }
}