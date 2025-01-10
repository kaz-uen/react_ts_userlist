import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/features/UserSlice";
import { useSelector, AppDispatch } from "@/store/Index";
import type { User, TabType, SortableKeys } from "@/types/userList";
import styles from "./Index.module.scss";
import ButtonComponent from "@/components/userList/Button";
import AllUserList from "./AllUserList";
import StudentList from "./StudentList";
import MentorList from "./MentorList";
import Tab from "./Tab";

/**
 * ユーザーリスト
 */
export default function Index(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const { userListData, status, error } = useSelector(state => state.user);

  const [userList, setUserList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [activeSortButton, setActiveSortButton] = useState<SortableKeys | "">("");

  const [selectedHobby, setSelectedHobby] = useState<string>("");
  const [selectedStudyLang, setSelectedStudyLang] = useState<string>("");
  const [selectedUseLang, setSelectedUseLang] = useState<string>("");

  // 現在選択されている全てのフィルター条件に基づいてユーザーリストをフィルタリング
  const applyFilters = useCallback(() => {
    const filteredList = userListData.filter((user: User) => {
      const { role, hobbies, studyLangs, useLangs } = user;

      // タブによるフィルタリング
      const matchesTab = activeTab === "all" || role === activeTab;
      // 趣味によるフィルタリング
      const matchesHobby = !selectedHobby || hobbies.includes(selectedHobby);
      // 勉強中の言語によるフィルタリング（生徒のみ）
      const matchesStudyLang = !selectedStudyLang ||
        (role === "student" && studyLangs?.includes(selectedStudyLang));
      // 現場で使っている言語によるフィルタリング（メンターのみ）
      const matchesUseLang = !selectedUseLang ||
        (role === "mentor" && useLangs?.includes(selectedUseLang));

      // 全ての条件を組み合わせる
      return matchesTab && matchesHobby && matchesStudyLang && matchesUseLang;
    });

    setUserList(filteredList);
  }, [selectedHobby, selectedStudyLang, selectedUseLang, activeTab, userListData]);

  // ステート変更時にフィルタリング処理実行
  useEffect(() => {
    applyFilters();
  }, [selectedHobby, selectedStudyLang, selectedUseLang, activeTab, userListData, status]);

  // 初回マウント時にユーザーデータを取得
  useEffect(() => {
    if(status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // ローディング表示
  if (status === 'loading') {
    return <div>読み込み中...</div>;
  }

  // エラー表示
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // ロールでユーザーを絞り込み
  const filterUserList = (role: TabType) => {
    const filteredList = role === "all"
      ? userListData
      : userListData.filter((user: User) => user.role === role);
    setUserList(filteredList);
  };

  // タブのクリックをハンドリング
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);

    // 全てのフィルター条件をリセット
    setSelectedHobby("");
    setSelectedStudyLang("");
    setSelectedUseLang("");

    // タブに応じたユーザーリストを表示
    filterUserList(tab);
  };

  // ユーザーリストソート処理
  const sortUsers = (key : SortableKeys) => {
    setActiveSortButton(key);
    const clonedUserList = [...userList];

    clonedUserList.sort((a, b) => {
      switch(key) {
        case "studyMinutesAsc":
        case "studyMinutesDesc": {
          const aStudyMinutes = a.studyMinutes;
          const bStudyMinutes = b.studyMinutes;
          if (aStudyMinutes === undefined && bStudyMinutes === undefined) return 0;
          if (aStudyMinutes === undefined) return 1;
          if (bStudyMinutes === undefined) return -1;
          return key === "studyMinutesAsc"
            ? aStudyMinutes - bStudyMinutes
            : bStudyMinutes - aStudyMinutes;
        }
        case "scoreAsc":
        case "scoreDesc": {
          const aScore = a.score;
          const bScore = b.score;
          if (aScore === undefined && bScore === undefined) return 0;
          if (aScore === undefined) return 1;
          if (bScore === undefined) return -1;
          return key === "scoreAsc" ? aScore - bScore : bScore - aScore;
        }
        case "experienceDaysAsc":
        case "experienceDaysDesc": {
          const aExperienceDays = a.experienceDays;
          const bExperienceDays = b.experienceDays;
          if (aExperienceDays === undefined && bExperienceDays === undefined) return 0;
          if (aExperienceDays === undefined) return 1;
          if (bExperienceDays === undefined) return -1;
          return key === "experienceDaysAsc"
            ? aExperienceDays - bExperienceDays
            : bExperienceDays - aExperienceDays;
        }
        default:
          return 0;
      }
    });

    setUserList(clonedUserList);
  };

  // 趣味でユーザーを絞り込む関数
  const filterUsersByHobby = (hobby: string) => {
    setSelectedHobby(hobby);
  };

  // 勉強中の言語でユーザーを絞り込む関数
  const filterUsersByStudyLang = (studyLang: string) => {
    setSelectedStudyLang(studyLang);
  };

  // 現場で使っている言語で絞り込む関数
  const filterUserByUseLang = (useLang: string) => {
    setSelectedUseLang(useLang);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ユーザーリスト</h1>

      <div className={styles.head}>
        <Tab
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
        <ButtonComponent />
      </div>

      <div className={styles.main}>
        <div className={styles.inner}>
          {activeTab === "all" && (
            <AllUserList
              userList={userList}
              userListData={userListData}
              selectedHobby={selectedHobby}
              onHobbyFilter={filterUsersByHobby}
            />
          )}
          {activeTab === "student" && (
            <StudentList
              userList={userList}
              userListData={userListData}
              selectedHobby={selectedHobby}
              selectedStudyLang={selectedStudyLang}
              activeSortButton={activeSortButton}
              onHobbyFilter={filterUsersByHobby}
              onStudyLangFilter={filterUsersByStudyLang}
              onSort={sortUsers}
            />
          )}
          {activeTab === "mentor" && (
            <MentorList
              userList={userList}
              userListData={userListData}
              selectedHobby={selectedHobby}
              selectedUseLang={selectedUseLang}
              activeSortButton={activeSortButton}
              onHobbyFilter={filterUsersByHobby}
              onUseLangFilter={filterUserByUseLang}
              onSort={sortUsers}
            />
          )}
        </div>
      </div>
    </div>
  )
};
