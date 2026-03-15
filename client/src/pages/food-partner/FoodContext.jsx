import { createContext, useCallback, useMemo, useState } from "react";
import {
  createFoodItem,
  fetchFeedItems,
  fetchFoodPartnerProfile,
  fetchSavedFoods,
  toggleFoodLike,
  toggleFoodSave,
} from "./services/food.api";

export const FoodContext = createContext(null);

function replaceFoodItem(items, updatedFood) {
  return items.map((item) =>
    item._id === updatedFood._id ? { ...item, ...updatedFood } : item,
  );
}

function upsertFoodItem(items, updatedFood) {
  const hasItem = items.some((item) => item._id === updatedFood._id);
  return hasItem
    ? replaceFoodItem(items, updatedFood)
    : [updatedFood, ...items];
}

function normalizeSavedFoods(savedFoods = []) {
  return savedFoods.map((item) => item.food ?? item);
}

export const FoodProvider = ({ children }) => {
  const [feedItems, setFeedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [foodPartnerProfile, setFoodPartnerProfile] = useState(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [creatingFood, setCreatingFood] = useState(false);
  const [foodError, setFoodError] = useState("");

  const clearFoodError = useCallback(() => {
    setFoodError("");
  }, []);

  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    clearFoodError();
    try {
      const data = await fetchFeedItems();
      const items = data.foodItems ?? [];
      setFeedItems(items);
      return items;
    } catch (error) {
      setFoodError(error.message);
      throw error;
    } finally {
      setFeedLoading(false);
    }
  }, [clearFoodError]);

  const loadSavedItems = useCallback(async () => {
    setSavedLoading(true);
    clearFoodError();
    try {
      const data = await fetchSavedFoods();
      const items = normalizeSavedFoods(data.savedFoods);
      setSavedItems(items);
      return items;
    } catch (error) {
      setFoodError(error.message);
      throw error;
    } finally {
      setSavedLoading(false);
    }
  }, [clearFoodError]);

  const handleToggleLike = useCallback(
    async (foodId) => {
      clearFoodError();
      try {
        const data = await toggleFoodLike(foodId);

        if (data.food) {
          setFeedItems((prev) => replaceFoodItem(prev, data.food));
          setSavedItems((prev) => replaceFoodItem(prev, data.food));
          setFoodPartnerProfile((prev) =>
            prev
              ? {
                  ...prev,
                  foodItems: replaceFoodItem(prev.foodItems ?? [], data.food),
                }
              : prev,
          );
        }

        return data;
      } catch (error) {
        setFoodError(error.message);
        throw error;
      }
    },
    [clearFoodError],
  );

  const handleToggleSave = useCallback(
    async (foodId) => {
      clearFoodError();
      try {
        const data = await toggleFoodSave(foodId);

        if (data.food) {
          setFeedItems((prev) => replaceFoodItem(prev, data.food));
          setSavedItems((prev) =>
            data.save
              ? upsertFoodItem(prev, data.food)
              : prev.filter((item) => item._id !== data.food._id),
          );
          setFoodPartnerProfile((prev) =>
            prev
              ? {
                  ...prev,
                  foodItems: replaceFoodItem(prev.foodItems ?? [], data.food),
                }
              : prev,
          );
        }

        return data;
      } catch (error) {
        setFoodError(error.message);
        throw error;
      }
    },
    [clearFoodError],
  );

  const handleCreateFood = useCallback(
    async ({ name, description, videoFile }) => {
      setCreatingFood(true);
      clearFoodError();
      try {
        const data = await createFoodItem({ name, description, videoFile });
        return data.food ?? null;
      } catch (error) {
        setFoodError(error.message);
        throw error;
      } finally {
        setCreatingFood(false);
      }
    },
    [clearFoodError],
  );

  const loadFoodPartnerProfile = useCallback(
    async (id) => {
      setProfileLoading(true);
      clearFoodError();
      try {
        const data = await fetchFoodPartnerProfile(id);
        const profile = data.foodPartner ?? null;
        setFoodPartnerProfile(profile);
        return profile;
      } catch (error) {
        setFoodPartnerProfile(null);
        setFoodError(error.message);
        throw error;
      } finally {
        setProfileLoading(false);
      }
    },
    [clearFoodError],
  );

  const value = useMemo(
    () => ({
      feedItems,
      savedItems,
      foodPartnerProfile,
      feedLoading,
      savedLoading,
      profileLoading,
      creatingFood,
      foodError,
      clearFoodError,
      loadFeed,
      loadSavedItems,
      handleToggleLike,
      handleToggleSave,
      handleCreateFood,
      loadFoodPartnerProfile,
    }),
    [
      feedItems,
      savedItems,
      foodPartnerProfile,
      feedLoading,
      savedLoading,
      profileLoading,
      creatingFood,
      foodError,
      clearFoodError,
      loadFeed,
      loadSavedItems,
      handleToggleLike,
      handleToggleSave,
      handleCreateFood,
      loadFoodPartnerProfile,
    ],
  );

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};
