import { Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import BaseLayout from "./layouts/BaseLayout";

const AppRoutes = () => {
  return (
    <BaseLayout>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />

      </Routes>
      </LocalizationProvider>
    </BaseLayout>
  );
};

export default AppRoutes;