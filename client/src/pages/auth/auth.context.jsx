import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  foodPartnerLogin,
  foodPartnerLogout,
  foodPartnerProfile,
  foodPartnerRegister,
  userLogin,
  userLogout,
  userProfile,
  userRegister,
} from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const clearAuthError = useCallback(() => {
    setAuthError("");
  }, []);

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await userProfile();
      setUser(userData.user ?? null);
      setFoodPartner(null);
    } catch {
      setUser(null);
      try {
        const foodPartnerData = await foodPartnerProfile();
        setFoodPartner(foodPartnerData.foodPartner ?? null);
      } catch {
        setFoodPartner(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleUserRegister = useCallback(
    async ({ fullName, email, password }) => {
      setLoading(true);
      clearAuthError();
      try {
        const data = await userRegister({ fullName, email, password });
        setUser(data.user ?? null);
        setFoodPartner(null);
        return data.user;
      } catch (error) {
        setUser(null);
        setAuthError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthError],
  );

  const handleUserLogin = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      clearAuthError();
      try {
        const data = await userLogin({ email, password });
        setUser(data.user ?? null);
        setFoodPartner(null);
        return data.user;
      } catch (error) {
        setUser(null);
        setAuthError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthError],
  );

  const handleUserLogout = useCallback(async () => {
    setLoading(true);
    clearAuthError();
    try {
      await userLogout();
      setUser(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAuthError]);

  const handleFoodPartnerRegister = useCallback(
    async ({ businessName, contactName, phone, address, email, password }) => {
      setLoading(true);
      clearAuthError();
      try {
        const data = await foodPartnerRegister({
          businessName,
          contactName,
          phone,
          address,
          email,
          password,
        });
        const partner = data.foodPartner ?? data.user ?? null;
        setFoodPartner(partner);
        setUser(null);
        return partner;
      } catch (error) {
        setFoodPartner(null);
        setAuthError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthError],
  );

  const handleFoodPartnerLogin = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      clearAuthError();
      try {
        const data = await foodPartnerLogin({ email, password });
        const partner = data.foodPartner ?? data.user ?? null;
        setFoodPartner(partner);
        setUser(null);
        return partner;
      } catch (error) {
        setFoodPartner(null);
        setAuthError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [clearAuthError],
  );

  const handleFoodPartnerLogout = useCallback(async () => {
    setLoading(true);
    clearAuthError();
    try {
      await foodPartnerLogout();
      setFoodPartner(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAuthError]);

  const value = useMemo(
    () => ({
      user,
      foodPartner,
      loading,
      authError,
      clearAuthError,
      initializeAuth,
      handleUserRegister,
      handleUserLogin,
      handleUserLogout,
      handleFoodPartnerRegister,
      handleFoodPartnerLogin,
      handleFoodPartnerLogout,
    }),
    [
      user,
      foodPartner,
      loading,
      authError,
      clearAuthError,
      initializeAuth,
      handleUserRegister,
      handleUserLogin,
      handleUserLogout,
      handleFoodPartnerRegister,
      handleFoodPartnerLogin,
      handleFoodPartnerLogout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
