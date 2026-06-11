import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser, registerUser } from "../services/api.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch {
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.data.user);
    toast.success(res.data.message || "Registered successfully");
    return res;
  };

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.data.user);
    toast.success(res.data.message || "Logged in successfully");
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — clean usage in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
