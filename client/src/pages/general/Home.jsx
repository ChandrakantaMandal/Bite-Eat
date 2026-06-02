import React, { useEffect } from "react";
import ReelFeed from "../../components/ReelFeed";
import { useFood } from "../food-partner/hooks/useFood";
import "../../styles/reels.css";

const Home = () => {
  const {
    feedItems,
    feedLoading,
    foodError,
    loadFeed,
    handleToggleLike,
    handleToggleSave,
  } = useFood();

  useEffect(() => {
    loadFeed().catch(() => {
      // error is handled by food context
    });
  }, [loadFeed]);

  return (
    <ReelFeed
      items={feedItems}
      onLike={(item) => handleToggleLike(item._id)}
      onSave={(item) => handleToggleSave(item._id)}
      emptyMessage={
        foodError ||
        (feedLoading ? "Loading videos..." : "No videos available.")
      }
    />
  );
};

export default Home;
