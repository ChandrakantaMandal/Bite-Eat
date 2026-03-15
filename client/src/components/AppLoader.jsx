import React from "react";
import "../styles/loader.css";

const AppLoader = ({ message = "Loading..." }) => {
  return (
    <div className="app-loader" role="status" aria-live="polite">
      <div className="app-loader__spinner" aria-hidden="true" />
      <p className="app-loader__text">{message}</p>
    </div>
  );
};

export default AppLoader;