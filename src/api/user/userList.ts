import type { User } from "@/types/userList";
import type { ApiMethodConfig } from "@/middleware/httpRequest";

// APIで利用可能なメソッドの型を定義
type UserApiMethods = {
  // ユーザー一覧を取得するメソッドの型定義
  // 戻り値は ApiMethodConfig 型
  getUsers: () => ApiMethodConfig;

  // 新規ユーザーを作成するメソッドの型定義
  // userData パラメータは User 型から id を除外した型（新規作成時はid不要）
  // 戻り値は ApiMethodConfig 型
  createUser: (userData: Omit<User, "id">) => ApiMethodConfig;
};

// APIメソッドの実装をエクスポート
export const userApi: UserApiMethods = {
  // ユーザー一覧取得メソッドの実装
  getUsers: () => ({
    path: "/users", // エンドポイントのパス
    method: "get" as const, // HTTPメソッドをGETに指定（as const で型を固定）
  }),
  // ユーザー作成メソッドの実装
  createUser: (userData: Omit<User, "id">) => ({
    path: "/users", // エンドポイントのパス
    method: "post" as const, // HTTPメソッドをPOSTに指定（as const で型を固定）
    data: userData, // リクエストボディにユーザーデータを設定
  }),
};

/*
変数userApiは、APIメソッドの実際のHTTPリクエスト処理を行う部分で、apiModules（その中にuserApiを含む）を使用してリクエストを構築しています。
このような構造により：
1. APIの定義（userApi = 本ファイル）
2. APIモジュールの集約（apiModules.tsファイル）
3. 実際のHTTPリクエスト処理（httpRequest.ts）
4. Reduxアクションでの使用（UserSlice.ts）
という流れでデータのやり取りが行われています。
これにより、APIの定義と実装が分離され、型安全性が保たれながら、再利用可能なAPI呼び出しの仕組みが実現されています。
 */
