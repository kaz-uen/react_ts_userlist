import axios, { AxiosInstance, AxiosError } from "axios";

// APIレスポンスの共通型定義
// Tは任意の型を受け取るジェネリック型パラメータ
interface ApiResponse<T> {
  data: T;                  // レスポンスデータ（型はTで指定）
  status?: number;          // HTTPステータスコード（省略可能）
  message?: string;         // レスポンスメッセージ（省略可能）
}

// APIメソッドの設定を定義するインターフェース
export interface ApiMethodConfig {
  path: string;             // APIエンドポイントのパス
  method: "get" | "post" | "put" | "delete";  // HTTPメソッド（リテラル型で制限）
  data?: any;              // リクエストボディ（省略可能）
  handler?: () => Promise<ApiResponse<any>>;  // カスタムハンドラー関数（省略可能）
}

// APIメソッド関数の型定義
// 任意の引数を受け取り、ApiMethodConfigを返す関数型
type ApiMethodFunction = {
  <T extends any[]>(...args: T): ApiMethodConfig;
};

// APIメソッドの集合を表すインターフェース
// 動的なキーを持つオブジェクト型（インデックスシグネチャ）
interface ApiMethods {
  [key: string]: {  // 外側のキー（例：'user'）
    [key: string]: (...args: any[]) => Promise<ApiResponse<any>>;  // 内側のキー（例：'getUsers'）
  };
}

// APIエラーの型定義
interface ApiError {
  status: number;   // HTTPステータスコード
  message: string;  // エラーメッセージ
}

// 型ガード関数：受け取ったエラーがApiError型かどうかを判定
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  )
};

// エラーハンドリング共通処理
const handleApiError = (error: unknown): ApiError => {
  // Axiosのエラーの場合
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status ?? 500,
      message: error.response?.data?.message ?? "APIエラーが発生しました"
    }
  }
  // ApiErrorの場合
  if (isApiError(error)) {
    return error;
  }
  // その他のエラーの場合
  return {
    status: 500,
    message: "予期せぬエラーが発生しました"
  }
};

// APIコールをラップしてエラーハンドリングを提供する関数
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

// シングルトンパターンのためのインスタンス保持変数
let apiInstance: ApiMethods | null = null;

// axiosインスタンスの生成
const createAxiosInstance = (): AxiosInstance => {
  return axios.create({
    // 環境変数に応じてベースURLを切り替え
    baseURL: import.meta.env.VITE_API_MODE === "mock" ? "" : "http://localhost:3000/api",
    timeout: 5000,  // タイムアウト設定（5秒）
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// APIメソッドを生成する関数
const createApiMethods = async (axiosInstance: AxiosInstance): Promise<ApiMethods> => {
  // モックモードの場合の処理
  if (import.meta.env.VITE_API_MODE === "mock") {
    const { createMockAdapter } = await import("@/mock/api/config/mockConfig");
    const mock = createMockAdapter(axiosInstance);
    console.log(mock)

    // モックハンドラーを設定
    const mockHandlers = await import ("@/mock/api/modules/index");
    Object.values(mockHandlers).forEach(handler => handler(mock));
  }

  // APIモジュールを動的インポート
  const { apiModules } = await import("@/api/apiModules");

  // APIメソッドの実装を生成
  return Object.entries(apiModules).reduce((acc, [key, methods]) => {
    console.log("モックではない時の処理")
    // 各APIモジュール（例：user）に対する処理
    acc[key] = Object.entries(methods).reduce((methodAcc, [methodName, method]) => {
      // 各メソッド（例：getUsers）に対する処理
      methodAcc[methodName] = (...args: Parameters<typeof method>) => {
        const request = (method as ApiMethodFunction)(...args);
        // カスタムハンドラーがある場合はそれを使用
        if (request.handler) return withErrorHandler(request.handler);
        // デフォルトのaxiosリクエスト
        return withErrorHandler(() =>
          axiosInstance[request.method]<any>(request.path, request.data)
        );
      };
      return methodAcc;
    }, {} as Record<string, (...args: any[]) => Promise<ApiResponse<any>>>);

    return acc;
  }, {} as ApiMethods);
};

// APIインスタンスを取得する関数（シングルトンパターン）
export const getApi = async (): Promise<ApiMethods> => {
  if (!apiInstance) {
    console.log("!apiInstance")
    // インスタンスが未作成の場合は新規作成
    apiInstance = await createApiMethods(createAxiosInstance());
  }
  console.log(apiInstance)
  return apiInstance;
};
