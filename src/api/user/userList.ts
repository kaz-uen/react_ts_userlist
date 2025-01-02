import axios from "axios";
import type { User } from "@/types/userList";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userApi = {
  getUsers: () => axiosInstance.get<User[]>("/users"),
  createUser: (userData: Omit<User, "id">) => axiosInstance.post<User>('/users', userData),
};


// import type { User } from "@/types/userList";
// import userListData from "@/utils/userListData";

// export const userApi = {
//   getUsers: () => {
//     return Promise.resolve({ data: userListData });
//   },
//   createUser: (userData: Omit<User, "id">) => {
//     const getMaxUserId = () => Math.max(...userListData.map((user) => user.id));
//     const newUser = {
//       ...userData,
//       id: userListData.length !== 0 ? getMaxUserId() + 1 : 1,
//     };
//     userListData.push(newUser);
//     return Promise.resolve({ data: newUser });
//   },
// };
