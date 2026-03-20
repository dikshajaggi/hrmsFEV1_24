import { Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import LeaveStatus from "./pages/LeaveStatus";
import Approvals from "./pages/Approvals";
import Policies from "./pages/Policies";
import Attendance from "./pages/Attendance";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FirstLogin from "./pages/FirstLogin";

import BaseLayout from "./layouts/BaseLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import EmpBulkUpload from "./pages/EmpBulkUpload";
import EmployeeEditPage from "./pages/EmployeeEdit";

const AppRoutes = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<FirstLogin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave-status" element={<LeaveStatus />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/employees/bulk-upload" element={<EmpBulkUpload />} />
             <Route path="/employees/edit/:id" element={<EmployeeEditPage />} />
          </Route>
        </Route>

      </Routes>
    </LocalizationProvider>
  );
};

export default AppRoutes;