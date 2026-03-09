import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important for refresh token cookies
});


// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE INTERCEPTOR (refresh token handling)
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {

        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        sessionStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (err) {
        console.log(err, "error")
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";

      }
    }

    return Promise.reject(error);
  }
);

export default api;


// This handles automatically:

// ✅ attach access token
// ✅ refresh token via cookie
// ✅ retry failed requests
// ✅ redirect to login if session expired