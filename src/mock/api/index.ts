/**
 * モックAPIの初期化とエクスポート
 */
import { axiosInstance } from "@/mock/api/config/axios";
import { createMockAdapter } from "@/mock/api/config/mockConfig";
import { userMockHandlers } from "@/mock/api/modules/user";

// 環境変数に基づいてモックの作成と初期化
if (import.meta.env.VITE_API_MODE === "mock") {
  const mock = createMockAdapter(axiosInstance);
  userMockHandlers(mock);
}

// APIクライアントのエクスポート（UserSlice.tsで使用）
export { userApi } from "@/mock/api/modules/user";
