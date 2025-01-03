// import type { User } from "@/types/userList";
// import type { ApiMethodConfig } from "@/middleware/httpRequest";

// type UserApiMethods = {
//   getUsers: () => ApiMethodConfig;
//   createUser: (userData: Omit<User, "id">) => ApiMethodConfig;
// };

// export const userApi: UserApiMethods = {
//   getUsers: () => ({
//     path: "/users",
//     method: "get" as const,
//   }),
//   createUser: (userData: Omit<User, "id">) => ({
//     path: "/users",
//     method: "post" as const,
//     data: userData,
//   }),
// };


import type { User } from "@/types/userList";
import type { ApiMethodConfig } from "@/middleware/httpRequest";
import userListData from "@/utils/userListData";

let localUserList: User[] = [...userListData];

type UserApiMethods = {
  getUsers: () => ApiMethodConfig;
  createUser: (userData: Omit<User, "id">) => ApiMethodConfig;
};

export const userApi: UserApiMethods = {
  getUsers: () => ({
    path: "/users",
    method: "get" as const,
    handler: async () => {
      return { data: localUserList, status: 200 };
    }
  }),
  createUser: (userData: Omit<User, "id">) => ({
    path: "/users",
    method: "post" as const,
    data: userData,
    handler: async () => {
      const newUser = {
        ...userData,
        id: localUserList.length > 0
          ? Math.max(...localUserList.map(user => user.id)) + 1
          : 1,
      };
      localUserList.push(...localUserList, newUser);
      return { data: newUser, status: 201 };
    }
  })
};
