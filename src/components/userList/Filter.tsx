import { useMemo } from "react";
import type { User } from "@/types/userList";
import Filter from "@/components/Filter";
import styles from "./Filter.module.scss";

type FilterProps = {
  selectedHobby: string;
  selectedStudyLang?: string;
  selectedUseLang?: string;
  onHobbyFilter: (hobby: string) => void;
  onStudyLangFilter?: (lang: string) => void;
  onUseLangFilter?: (lang: string) => void;
  userListData: User[];
};

/**
 * ユーザー絞り込みフィルター
 */
export default function FilterComponent({
  selectedHobby,
  selectedStudyLang,
  selectedUseLang,
  onHobbyFilter,
  onStudyLangFilter,
  onUseLangFilter,
  userListData
}: FilterProps): JSX.Element {
  // 趣味の選択肢を生成
  const hobbyOptions = useMemo(() => {
    const hobbies = new Set<string>();
    userListData.forEach((user: User) => {
      user.hobbies.forEach((hobby) => hobbies.add(hobby));
    });
    return Array.from(hobbies);
  }, [userListData]);

  // 勉強中の言語の選択肢を生成
  const studyLangOptions = useMemo(() => {
    const langs = new Set<string>();
    userListData
      .filter((user: User) => user.role === "student")
      .forEach((user: User) => user.studyLangs?.forEach((lang) => langs.add(lang)));
    return Array.from(langs);
  }, [userListData]);

  // 使用言語の選択肢を生成
  const useLangOptions = useMemo(() => {
    const langs = new Set<string>();
    userListData
      .filter((user: User) => user.role === "mentor")
      .forEach((user: User) => user.useLangs?.forEach((lang) => langs.add(lang)));
    return Array.from(langs);
  }, [userListData]);

  return (
    <div className={styles.header}>
      <div className={styles.filters}>
        <span className={styles.filtersTitle}>ユーザーの絞り込み</span>

        {/* 共通：趣味フィルター */}
        <Filter
          label="趣味"
          id="hobbyFilter"
          value={selectedHobby}
          onChange={onHobbyFilter}
          options={hobbyOptions}
        />

        {/* 生徒：勉強中の言語フィルター */}
        {onStudyLangFilter && (
          <Filter
            label="勉強中の言語"
            id="studyLangFilter"
            value={selectedStudyLang}
            onChange={onStudyLangFilter}
            options={studyLangOptions}
          />
        )}

        {/* メンター：現場で使っている言語フィルター */}
        {onUseLangFilter && (
          <Filter
            label="現場で使っている言語"
            id="useLangFilter"
            value={selectedUseLang}
            onChange={onUseLangFilter}
            options={useLangOptions}
          />
        )}
      </div>
    </div>
  )
};
