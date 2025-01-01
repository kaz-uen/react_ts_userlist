import type { User } from "@/types/userList";
import Layout from "@/components/userList/Layout";
import Filter from "@/components/userList/Filter";
import Table from "@/components/userList/Table";

type AllUserListProps = {
  userList: User[];
  userListData: User[];
  selectedHobby: string;
  onHobbyFilter: (hobby: string) => void;
};

/**
 * ユーザーリスト「全員」
 */
export default function AllUserList({
  userList,
  userListData,
  selectedHobby,
  onHobbyFilter
}: AllUserListProps): JSX.Element {
  // テーブルに表示する列を定義
  const columns: (keyof User)[] = ["id", "name", "role", "email", "age", "postCode", "phone", "hobbies", "url", "studyMinutes", "taskCode", "studyLangs", "score", "experienceDays", "useLangs", "availableStartCode", "availableEndCode"];

  const renderHeader = (
    <Filter
      selectedHobby={selectedHobby}
      onHobbyFilter={onHobbyFilter}
      userListData={userListData}
    />
  );

  const renderContent = userList.length ? (
    <Table
      users={userList}
      columns={columns}
    />
  ) : (
    "該当するユーザーがいません"
  );

  return (
    <Layout
      header={renderHeader}
      content={renderContent}
    />
  )
};
