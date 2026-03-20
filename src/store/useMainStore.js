import { create } from "zustand";
import { getDashboard, logoutUser } from "../apis";

export const useMainStore = create((set, get) => ({

  userDetails: JSON.parse(sessionStorage.getItem("userDetails")) || null,

  setUserDetails: (user) => {
    sessionStorage.setItem("userDetails", JSON.stringify(user));
    set({ userDetails: user });
  },

  isAuthenticated: () => !!get().userDetails,

  dashboardData: null,
  loadingDashboard: false,

  loadDashboard: async () => {
    try {
      set({ loadingDashboard: true });

      const res = await getDashboard();
      console.log(res, "res check")

      set({ dashboardData: res.data });

    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      set({ loadingDashboard: false });
    }
  },

  // 🚪 LOGOUT
  logout: async (navigate) => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout API failed", err);
    }

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userDetails");

    set({ userDetails: null, dashboardData: null });

    navigate("/login");
  }

}));