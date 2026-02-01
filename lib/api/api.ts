import axios, { AxiosInstance } from "axios";

/* ================= AXIOS INSTANCES ================= */

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiServer: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
