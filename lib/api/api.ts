import axios, { AxiosInstance } from "axios";

/* ================= AXIOS INSTANCES ================= */

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getClientToken = () => {
  if (typeof window === "undefined") return undefined;
  const fromStorage = localStorage.getItem("token");
  if (fromStorage) return fromStorage;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find(
      (c) =>
        c.startsWith("accessToken=") ||
        c.startsWith("access_token=") ||
        c.startsWith("auth-token=")
    );
  if (!match) return undefined;
  const [, value] = match.split("=");
  return value;
};

apiClient.interceptors.request.use((config) => {
  const token = getClientToken();
  if (token) {
    config.headers = config.headers ?? {};
    if (typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else {
      (
        config.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const apiServer: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
