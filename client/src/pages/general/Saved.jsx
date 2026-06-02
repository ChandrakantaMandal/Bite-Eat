import React, { useEffect } from "react";
import ReelFeed from "../../components/ReelFeed";
import { useFood } from "../food-partner/hooks/useFood";
import "../../styles/reels.css";

const Saved = () => {
  const {
    savedItems,
    savedLoading,
    foodError,
    loadSavedItems,
    handleToggleSave,
  } = useFood();

  useEffect(() => {
    loadSavedItems().catch(() => {
      // error is handled by food context
    });
  }, [loadSavedItems]);

  return (
    <ReelFeed
      items={savedItems}
      onSave={(item) => handleToggleSave(item._id)}
      emptyMessage={
        foodError ||
        (savedLoading ? "Loading saved videos..." : "No saved videos yet.")
      }
    />
  );
};

export default Saved;
