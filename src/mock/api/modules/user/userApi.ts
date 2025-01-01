import { axiosInstance } from "@/mock/api/config/axios";
import type { User } from "@/types/userList";

/**
 * ユーザー関連のAPIクライアント
 */
export const userApi = {
  // 全ユーザーリストを取得
  getUsers: () => axiosInstance.get<User[]>("/users"),
  // 新規ユーザーを作成（idは自動生成されるため、入力から除外）
  createUser: (userData: Omit<User, "id">) => axiosInstance.post<User>('/users', userData),
};
