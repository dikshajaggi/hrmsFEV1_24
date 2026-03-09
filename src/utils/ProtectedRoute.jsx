import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainContext } from "../context/MainContext";

const ProtectedRoute = () => {

  const { userDetails } = useContext(MainContext);
  const token = sessionStorage.getItem("accessToken");

  if (!token || !userDetails) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;