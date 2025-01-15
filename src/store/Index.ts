// Redux関連の型安全なフックを使用するために必要なインポート
// rawUseSelector: 基本的なuseSelector フック
// TypedUseSelectorHook: TypeScript用のジェネリック型
import { useSelector as rawUseSelector, TypedUseSelectorHook } from "react-redux";

// @reduxjs/toolkit からストア設定用のユーティリティをインポート
// configureStore: Redux DevTools等の開発ツールが自動で設定され、
// middleware等のデフォルト設定も含まれている便利な関数
import { configureStore } from "@reduxjs/toolkit";

// 各機能のスライスで定義したReducerをインポート
// userReducer: ユーザー情報（ログイン状態、プロフィール等）の状態管理
// modalReducer: モーダルの表示状態や内容の管理
import userReducer from "@/features/UserSlice";
import modalReducer from "@/features/ModalSlice";

// アプリケーションのグローバルストアを作成
// configureStore により、Redux DevTools、Thunk middleware等が自動で設定される
export const store = configureStore({
  reducer: {
    // 複数のReducerを1つのストアに結合
    user: userReducer,    // ユーザー関連のステート（例: {id: 1, name: "user", ...}）
    modal: modalReducer,  // モーダル関連のステート（例: {isOpen: false, content: null}）
  }
});

// ストアのルート状態の型定義
// ReturnType<typeof store.getState> により、
// ストア全体の状態の型（例: {user: UserState, modal: ModalState}）を自動的に推論
export type RootState = ReturnType<typeof store.getState>;

// 型安全なuseSelector フックの作成
// TypedUseSelectorHook<RootState>により、useSelector使用時に
// 自動的にストアの型情報が提供され、型エラーを事前に検出可能
// 使用例: const userName = useSelector(state => state.user.name)
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;

// dispatch関数の型定義
// store.dispatchの型を取得し、アクションのディスパッチ時の型チェックを可能に
// これにより、不正なアクションのディスパッチを防止
// 使用例: dispatch(userActions.setUser({ id: 1, name: "user" }))
export type AppDispatch = typeof store.dispatch;
