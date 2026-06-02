import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFood } from "../hooks/useFood";
import "../../../styles/create-food.css";

const Profile = () => {
  const { id } = useParams();
  const {
    foodPartnerProfile,
    profileLoading,
    foodError,
    loadFoodPartnerProfile,
  } = useFood();

  useEffect(() => {
    loadFoodPartnerProfile(id).catch(() => {
      // error is handled by food context
    });
  }, [id, loadFoodPartnerProfile]);

  const videos = foodPartnerProfile?.foodItems ?? [];

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business" title="Business name">
              {foodPartnerProfile?.name ||
                (profileLoading ? "Loading..." : "Food partner")}
            </h1>
            <p className="profile-pill profile-address" title="Address">
              {foodPartnerProfile?.address ||
                foodError ||
                "Address not available"}
            </p>
          </div>
        </div>

        <div className="profile-stats" role="list" aria-label="Stats">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">total meals</span>
            <span className="profile-stat-value">
              {foodPartnerProfile?.totalMeals ?? videos.length}
            </span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">customer served</span>
            <span className="profile-stat-value">
              {foodPartnerProfile?.customersServed ?? 0}
            </span>
          </div>
        </div>
      </section>

      <hr className="profile-sep" />

      <section className="profile-grid" aria-label="Videos">
        {videos.map((video) => (
          <div key={video._id} className="profile-grid-item">
            <video
              className="profile-grid-video"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={video.video}
              muted
              playsInline
            ></video>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;
