import { createContext, useState, useEffect } from "react";
import { logoutUser } from "../apis";
import { useNavigate } from "react-router-dom";

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = sessionStorage.getItem("userDetails");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isAuthenticated = !!userDetails;

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout API failed", err);
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userDetails");

    setUserDetails(null);

    navigate("/login");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      setUserDetails(null);
    }
  }, []);

  const mainContextValue = {
    userDetails,
    setUserDetails,
    logout,
    isAuthenticated
  };

  return (
    <MainContext.Provider value={mainContextValue}>
      {children}
    </MainContext.Provider>
  );
};