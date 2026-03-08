import { Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Register from "./pages/Register";

import BaseLayout from "./layouts/BaseLayout";
import Login from "./pages/Login";
import FirstLogin from "./pages/FirstLogin";
import ForgotPassword from "./pages/ForgotPassword";

const AppRoutes = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>

        {/* Public routes (no layout) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/first-login" element={<FirstLogin />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

        {/* App routes (with layout) */}
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Route>

      </Routes>
    </LocalizationProvider>
  );
};

export default AppRoutes;