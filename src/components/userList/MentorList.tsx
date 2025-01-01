import type { User, SortableKeys } from "@/types/userList";
import Layout from "@/components/userList/Layout";
import Filter from "@/components/userList/Filter";
import SortButton from "@/components/userList/SortButton";
import Table from "@/components/userList/Table";

type MentorListProps = {
  userList: User[];
  userListData: User[];
  selectedHobby: string;
  selectedUseLang: string;
  activeSortButton: string;
  onHobbyFilter: (hobby: string) => void;
  onUseLangFilter: (lang: string) => void;
  onSort: (key: SortableKeys) => void;
};

/**
 * ユーザーリスト「メンター」
 */
export default function MentorList({
  userList,
  userListData,
  selectedHobby,
  selectedUseLang,
  activeSortButton,
  onHobbyFilter,
  onUseLangFilter,
  onSort
}: MentorListProps): JSX.Element {
  const columns: (keyof User | "availableStudents")[] = ["id", "name", "role", "email", "age", "postCode", "phone", "hobbies", "url", "experienceDays", "useLangs", "availableStartCode", "availableEndCode", "availableStudents"];
  const students = userListData.filter((user: User) => user.role === "student");

  const renderHeader = (
    <>
      <Filter
        selectedHobby={selectedHobby}
        selectedUseLang={selectedUseLang}
        onHobbyFilter={onHobbyFilter}
        onUseLangFilter={onUseLangFilter}
        userListData={userListData}
      />
      <SortButton
        activeSortButton={activeSortButton}
        onSort={onSort}
        type="mentor"
      />
    </>
  );

  const renderContent = userList.length ? (
    <Table
      users={userList}
      columns={columns}
      students={students}
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
