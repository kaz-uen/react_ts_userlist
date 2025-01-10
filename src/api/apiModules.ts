import { userApi } from "./user/userList";

/**
 * 全てのAPIモジュールをまとめて管理
 */
export const apiModules = {
  user: userApi,
};

export type ApiModules = typeof apiModules;
/*
apiModulesオブジェクトから型を生成
typeof演算子を使用して、JavaScriptのオブジェクトから型情報を抽出
生成される型は以下のような構造になる：
{
  user: {
    getUsers: () => ApiMethodConfig;
    createUser: (userData: Omit<User, "id">) => ApiMethodConfig;
  }
}

現在のコードだとApiModules型はどのファイルでも直接的には使用されていないように見えますが、
この型定義により：
1. APIモジュールの型安全性を確保
2. 新しいAPIモジュールを追加する際の型チェックが可能
3. IDEでのコード補完機能のサポート
4. APIの構造変更時の型エラーを早期発見
といったメリットがあるため、型の定義は維持することが推奨される。
*/
