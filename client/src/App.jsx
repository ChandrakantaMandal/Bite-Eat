import React from "react";

import "./App.css";
import "./styles/theme.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./pages/auth/auth.context";
import { FoodProvider } from "./pages/food-partner/FoodContext";

function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <AppRoutes />
      </FoodProvider>
    </AuthProvider>
  );
}

export default App;
