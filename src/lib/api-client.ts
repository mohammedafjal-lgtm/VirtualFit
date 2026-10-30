import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.formErrors?.[0] ??
      err.response?.data?.error ??
      err.message;
    return Promise.reject(new Error(message));
  }
);