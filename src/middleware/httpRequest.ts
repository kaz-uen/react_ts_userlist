import type { User } from "@/types/userList";
import axios, { AxiosInstance, AxiosError } from "axios";

interface ApiResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

interface UserApiMethods {
  getUsers: () => Promise<ApiResponse<User[]>>;
  createUser: (userData: Omit<User, "id">) => Promise<ApiResponse<User>>;
}

interface ApiMethods {
  user: UserApiMethods;
}

// エラー型の定義
interface ApiError {
  status: number;
  message: string;
}

// ApiErrorのtype guard
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  )
};

// 共通のエラーハンドリング
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "APIエラーが発生しました"
    };
  }
  if (isApiError(error)) {
    return error;
  }

  return {
    status: 500,
    message: "予期せぬエラーが発生しました"
  }
};

// APIメソッドをラップする関数
const withErrorHandler = async <T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    return await apiCall();
  } catch (error) {
    const handleError = handleApiError(error);
    return Promise.reject(handleError);
  }
};

let apiInstance: ApiMethods | null = null;

// axiosインスタンスの生成
const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_MODE === "mock" ? "" : "http://localhost:3000/api",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// APIメソッド
const createApiMethods = async (axiosInstance: AxiosInstance): Promise<ApiMethods> => {
  if (import.meta.env.VITE_API_MODE === "mock") {
    const { createMockAdapter } = await import("@/mock/api/config/mockConfig");
    const { userMockHandlers } = await import("@/mock/api/modules/user/userHandlers");
    // 他のモックハンドラーをここにインポート
    const mock = createMockAdapter(axiosInstance);
    userMockHandlers(mock);
    // 他のモックハンドラーもここで初期化
  }

  return {
    user: {
      getUsers: () => withErrorHandler(() => axiosInstance.get<User[]>("/users")),
      createUser: (userData: Omit<User, "id">) =>
        withErrorHandler(() => axiosInstance.post<User>('/users', userData)),
    },
  };
};

export const getApi = async (): Promise<ApiMethods> => {
  if (!apiInstance) {
    apiInstance = await createApiMethods(createAxiosInstance());
  }
  return apiInstance;
};
