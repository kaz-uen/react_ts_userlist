import { userApi } from "./user/userList";

/**
 * 全てのAPIモジュールをまとめて管理
 */
export const apiModules = {
  user: userApi,
};

export type ApiModules = typeof apiModules;
