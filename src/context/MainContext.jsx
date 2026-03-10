import { createContext, useState, useEffect } from "react";
import { getDashboard, logoutUser } from "../apis";
import { useNavigate } from "react-router-dom";

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = sessionStorage.getItem("userDetails");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isAuthenticated = !!userDetails;

  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoadingDashboard(true);

      const res = await getDashboard();

      setDashboardData(res.data);

    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoadingDashboard(false);
    }
  };


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

  useEffect(() => {
    if (userDetails) {
      loadDashboard();
    }
  }, [userDetails]);

  const mainContextValue = {
    userDetails,
    setUserDetails,
    logout,
    isAuthenticated,
    dashboardData,
    loadingDashboard,
    loadDashboard
  };

  return (
    <MainContext.Provider value={mainContextValue}>
      {children}
    </MainContext.Provider>
  );
};