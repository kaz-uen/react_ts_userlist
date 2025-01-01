import axios from "axios";

/**
 * Axiosインスタンスの設定と作成
 */
export const axiosInstance = axios.create({
  // モードに応じてbaseURLを切り替え
  baseURL: import.meta.env.VITE_API_MODE === "api" ? "http://localhost:3000/api" : undefined,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
