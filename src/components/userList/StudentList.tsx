import type { User, SortableKeys } from "@/types/userList";
import Layout from "@/components/userList/Layout";
import Filter from "@/components/userList/Filter";
import SortButton from "@/components/userList/SortButton";
import Table from "@/components/userList/Table";

type StudentListProps = {
  userList: User[];
  userListData: User[];
  selectedHobby: string;
  selectedStudyLang: string;
  activeSortButton: string;
  onHobbyFilter: (hobby: string) => void;
  onStudyLangFilter: (lang: string) => void;
  onSort: (key: SortableKeys) => void;
};

/**
 * ユーザーリスト「生徒」
 */
export default function StudentList({
  userList,
  userListData,
  selectedHobby,
  selectedStudyLang,
  activeSortButton,
  onHobbyFilter,
  onStudyLangFilter,
  onSort
}: StudentListProps): JSX.Element {
  const columns: (keyof User | "availableMentors")[] = ["id", "name", "role", "email", "age", "postCode", "phone", "hobbies", "url", "studyMinutes", "taskCode", "studyLangs", "score", "availableMentors"];
  const mentors = userListData.filter((user: User) => user.role === "mentor");

  const renderHeader = (
    <>
      <Filter
        selectedHobby={selectedHobby}
        selectedStudyLang={selectedStudyLang}
        onHobbyFilter={onHobbyFilter}
        onStudyLangFilter={onStudyLangFilter}
        userListData={userListData}
      />
      <SortButton
        activeSortButton={activeSortButton}
        onSort={onSort}
        type="student"
      />
    </>
  );

  const renderContent = userList.length ? (
    <Table
      users={userList}
      columns={columns}
      mentors={mentors}
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
