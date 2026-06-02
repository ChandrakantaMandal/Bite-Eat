import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hook/useAuth";
import "../../styles/profile.css";

const PROFILE_AVATAR =
  "https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60";

const AccountProfile = () => {
  const navigate = useNavigate();
  const {
    user,
    foodPartner,
    loading,
    authError,
    clearAuthError,
    handleUserLogout,
    handleFoodPartnerLogout,
  } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isFoodPartner = Boolean(foodPartner);
  const profileName = foodPartner?.name ?? user?.fullName ?? "Profile";

  const profileDetails = useMemo(() => {
    if (isFoodPartner) {
      return [
        { label: "Business name", value: foodPartner?.name || "Not provided" },
        {
          label: "Contact name",
          value: foodPartner?.contactName || "Not provided",
        },
        { label: "Email", value: foodPartner?.email || "Not provided" },
        {
          label: "Phone number",
          value: foodPartner?.phoneNumber || "Not provided",
        },
        { label: "Address", value: foodPartner?.address || "Not provided" },
      ];
    }

    return [
      { label: "Full name", value: user?.fullName || "Not provided" },
      { label: "Email", value: user?.email || "Not provided" },
    ];
  }, [foodPartner, isFoodPartner, user]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      if (isFoodPartner) {
        await handleFoodPartnerLogout();
        navigate("/food-partner/login", { replace: true });
        return;
      }

      await handleUserLogout();
      navigate("/user/register", { replace: true });
    } catch {
      // error is handled by auth context
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-meta">
          <img
            className="profile-avatar"
            src={PROFILE_AVATAR}
            alt={profileName}
          />

          <div className="profile-info">
            <h1 className="profile-pill profile-business">{profileName}</h1>
            <p className="profile-pill profile-address">
              {isFoodPartner ? "Food partner account" : "User account"}
            </p>
          </div>
        </div>

        <div className="profile-stats" role="list" aria-label="Account summary">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">account type</span>
            <span className="profile-stat-value">
              {isFoodPartner ? "Partner" : "User"}
            </span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat-label">status</span>
            <span className="profile-stat-value">Active</span>
          </div>
        </div>
      </section>

      {authError ? (
        <p className="profile-error" role="alert">
          {authError}
        </p>
      ) : null}

      <section
        className="profile-section"
        aria-labelledby="account-details-title"
      >
        <h2 id="account-details-title" className="profile-section-title">
          Account details
        </h2>

        <div className="profile-details">
          {profileDetails.map((detail) => (
            <div key={detail.label} className="profile-detail-row">
              <span className="profile-detail-label">{detail.label}</span>
              <span className="profile-detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-actions" aria-label="Profile actions">
        <button
          type="button"
          className="profile-button profile-button-secondary"
          onClick={() => navigate(isFoodPartner ? "/create-food" : "/")}
        >
          {isFoodPartner ? "Create Food" : "Back to Home"}
        </button>
        <button
          type="button"
          className="profile-button profile-button-danger"
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </section>
    </main>
  );
};

export default AccountProfile;
