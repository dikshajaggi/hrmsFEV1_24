import { Navigate, Outlet } from "react-router-dom";
import { useMainStore } from "../store/useMainStore";

const ProtectedRoute = () => {

  const userDetails =  useMainStore((s) => s.userDetails); 
  const token = sessionStorage.getItem("accessToken");

  if (!token || !userDetails) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;