import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, isApiError } from "@/middleware/httpRequest";
import type { User, UserState } from "@/types/userList";

const initialState: UserState = {
  userListData: [],
  status: "idle",
  error: null,
};

// ユーザーデータ取得
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const api = await getApi();
      const response = await api.user.getUsers();
      return response.data;
    } catch(error) {
      if (isApiError(error) && error.status === 404) {
        // 404の場合は空配列を返す
        return [];
      }
      console.log(error)
      return rejectWithValue(error);
    } finally {
      // NOTE：あれば追加する
    }
  }
);

// 新規ユーザー登録
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: Omit<User, "id">) => {
    const api = await getApi();
    const response = await api.user.createUser(userData);
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
        console.log(state.error)
        console.log(action.error.message)
        state.status = 'failed';
        state.error = action.error.message ? "ユーザーデータの取得に失敗しました" : 'エラーが発生しました';
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
