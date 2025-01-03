// import type { User } from "@/types/userList";
import axios, { AxiosInstance, AxiosError } from "axios";

interface ApiResponse<T> {
  data: T;
  status?: number;
  message?: string;
}

export interface ApiMethodConfig {
  path: string;
  method: "get" | "post" | "put" | "delete";
  data?: any;
  handler?: () => Promise<ApiResponse<any>>;
}

type ApiMethodFunction = {
  <T extends any[]>(...args: T): ApiMethodConfig;
};

interface ApiMethods {
  [key: string]: {
    [key: string]: (...args: any[]) => Promise<ApiResponse<any>>;
  };
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
    }
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
export const withErrorHandler = async <T>(
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
    const mock = createMockAdapter(axiosInstance);
    console.log(mock)

    // この下のコードを、ユーザーデータのハンドリング処理に限定せず、今後modules/info/infoHandlersなどの処理が追加されることを見込んだコードにできないか？
    // const { userMockHandlers } = await import("@/mock/api/modules/user/userHandlers");
    // userMockHandlers(mock);
    // 全てのモックハンドラーをインポート
    const mockHandlers = await import ("@/mock/api/modules/index");
    Object.values(mockHandlers).forEach(handler => handler(mock));
  }

  // 全てのAPIメソッドを生成
  const { apiModules } = await import("@/api/apiModules");

  // この下のコードを、/usersの処理だけでなく、今後/infoなどのAPIが追加されることを見込んだコードに変更できないか？
  // return {
  //   user: {
  //     getUsers: () => withErrorHandler(() => axiosInstance.get<User[]>("/users")),
  //     createUser: (userData: Omit<User, "id">) =>
  //       withErrorHandler(() => axiosInstance.post<User>('/users', userData)),
  //   },
  // };
  return Object.entries(apiModules).reduce((acc, [key, methods]) => {
    console.log("モックではない時の処理")
    acc[key] = Object.entries(methods).reduce((methodAcc, [methodName, method]) => {
      methodAcc[methodName] = (...args: Parameters<typeof method>) => {
        const request = (method as ApiMethodFunction)(...args);
        if (request.handler) return withErrorHandler(request.handler);
        return withErrorHandler(() =>
          axiosInstance[request.method]<any>(request.path, request.data)
        );
      };
      return methodAcc;
    }, {} as Record<string, (...args: any[]) => Promise<ApiResponse<any>>>);

    return acc;
  }, {} as ApiMethods);
};

export const getApi = async (): Promise<ApiMethods> => {
  if (!apiInstance) {
    console.log("!apiInstance")
    apiInstance = await createApiMethods(createAxiosInstance());
  }
  console.log(apiInstance)
  return apiInstance;
};
