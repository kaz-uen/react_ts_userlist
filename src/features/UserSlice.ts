import { AxiosError } from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "@/mock/api";
import type { User, UserState } from "@/types/userList";

const initialState: UserState = {
  userListData: [],
  status: "idle",
  error: null,
};

// ユーザーデータ取得
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    try {
      const response = await userApi.getUsers();
      return response.data;
    } catch(e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 404) {
        // 404の場合は空配列を返す
        return [];
      }
      return Promise.reject(e);
    } finally {
      // NOTE：あれば追加する
    }
  }
);

// 新規ユーザー登録
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: Omit<User, "id">) => {
    const response = await userApi.createUser(userData);
    return response.data;
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      // リクエストが開始されたときの処理
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      // リクエストが成功したときの処理
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userListData = action.payload;
        state.error = action.payload.length === 0 ? "ユーザーデータが見つかりませんでした" : null;
      })
      // リクエストが失敗したときの処理
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'エラーが発生しました';
      })
      // addUser
      .addCase(addUser.fulfilled, (state, action) => {
        const getMaxUserId = () => Math.max(...state.userListData.map((user: User) => user.id));
        state.userListData.push({
          ...action.payload,
          id: state.userListData.length !== 0 ? getMaxUserId() + 1 : 1,
        });
      });
  }
});

export default UserSlice.reducer;
