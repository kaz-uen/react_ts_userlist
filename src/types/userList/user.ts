import type { Status } from "@/types/common";

// ユーザーロールの型定義
export type UserRole = "student" | "mentor";

// ユーザーの型定義
export type User = {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
  studyMinutes?: number;
  taskCode?: number;
  studyLangs?: string[];
  score?: number;
  experienceDays?: number;
  useLangs?: string[];
  availableStartCode?: number;
  availableEndCode?: number;
};

// フォームデータの型定義
export interface UserFormData {
  name: string;
  email: string;
  age: string;
  postCode: string;
  phone: string;
  hobbies: string;
  url: string;
  studyMinutes: string;
  taskCode: string;
  studyLangs: string;
  score: string;
  experienceDays: string;
  useLangs: string;
  availableStartCode: string;
  availableEndCode: string;
}

// 初期値
export interface UserState {
  userListData: User[];
  status: Status;
  error: string | null;
}
