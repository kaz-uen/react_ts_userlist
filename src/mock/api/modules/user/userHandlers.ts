import responses from "@/mock/responses";
import MockAdapter from "axios-mock-adapter";

/**
 * モックユーザーデータ
 */
const mockUsers = responses.userList;

/**
 * ユーザー関連のモックハンドラー
 */
export const userMockHandlers = (mock: MockAdapter) => {
  console.log("userMockHandlers")
  console.log(mock)
  // GETリクエストのモック => 全ユーザーリストを返す
  mock.onGet("/users").reply(() => {
    console.log(mockUsers)
    // ユーザーデータが空の場合は404を返す
    if (mockUsers.length === 0) {
      return [404, { message: "ユーザーデータが見つかりませんでした。" }];
    }
    return [200, mockUsers];
  });

  // POSTリクエストのモック => 新規ユーザーを作成し、作成されたユーザー情報を返す
  mock.onPost("/users").reply((config) => {
    const newUser = JSON.parse(config.data);
    const user = { ...newUser};
    mockUsers.push(user);
    return [201, user];
  });
};
