import type { User } from "@/types/userList";

// ユーザーリスト項目の日本語表記
export const columnLabels: Record<keyof User, string> = {
  id: "ID",
  name: "名前",
  role: "ロール",
  email: "メールアドレス",
  age: "年齢",
  postCode: "郵便番号",
  phone: "電話番号",
  hobbies: "趣味",
  url: "URL",
  studyMinutes: "勉強時間",
  taskCode: "課題番号",
  studyLangs: "勉強中の言語",
  score: "ハピネススコア",
  experienceDays: "実務経験月数",
  useLangs: "現場で使っている言語",
  availableStartCode: "担当できる課題番号初め",
  availableEndCode: "担当できる課題番号終わり",
};
