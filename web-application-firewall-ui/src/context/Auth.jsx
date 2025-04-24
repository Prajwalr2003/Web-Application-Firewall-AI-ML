import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedToken && storedRefreshToken) {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.status == 200) {
          setIsLoggedIn(true);
          setUser(res.data.user);
          console.log(res.data.user);
          localStorage.setItem("user", res.data.user);
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
        } else {
          try {
            const refreshRes = await axios.post(
              `${BACKEND_URL}/api/v1/user/refresh`,
              { refreshToken: storedRefreshToken }
            );
            if (refreshRes.status == 200) {
              const newToken = refreshRes.data.accessToken;
              localStorage.setItem("accessToken", newToken);
              setToken(newToken);
              setIsLoggedIn(true);
              setUser(refreshRes.data.user);
              console.log(refreshRes.data.user);
              localStorage.setItem("user", refreshRes.data.user);
            } else {
              localStorage.clear();
              setIsLoggedIn(false);
              setUser(null);
              setToken(null);
              setRefreshToken(null);
            }
          } catch (err) {
            console.error("Refresh token error:", err);
            localStorage.clear();
            setIsLoggedIn(false);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
          }
        }
      } catch (err) {
        console.error("Token verification error:", err);
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        setRefreshToken(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginUser = async (loginData) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/login`,
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type" : "application/json",
          },
        }
      );

      if (res.status === 200) {
        setIsLoggedIn(true);
        setUser(res.data.user);
        setToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        console.log(res);
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed.");
      }

      return res;
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login Failed", error);
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const authenticatedRequest = async (url, options = {}) => {
    try {
      const headers = { ...getAuthHeaders(), ...options.headers };
      const res = await axios({ ...options, url, headers });
      return res;
    } catch (err) {
      if (err.response?.status === 401) {
        logoutUser();
        navigate("/login");
      }
      throw err;
    }
  };

  return (
    <Auth.Provider
      value={{
        isLoggedIn,
        loading,
        user,
        setUser,
        loginUser,
        logoutUser,
        token,
        getAuthHeaders,
        authenticatedRequest,
        error,
        setError,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => useContext(Auth);
