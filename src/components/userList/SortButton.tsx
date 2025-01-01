import type { SortableKeys } from "@/types/userList";
import styles from "./SortButton.module.scss";

type SortButtonsProps = {
  activeSortButton: string;
  onSort: (key: SortableKeys) => void;
  type: "student" | "mentor";
};

/**
 * ソートボタン
 */
export default function SortButtons({
  activeSortButton,
  onSort,
  type
}: SortButtonsProps): JSX.Element {
  return (
    <div className={styles.sortButtons}>
      {type === "student" ? (
        <>
          <div className={styles.sortButtonGroup}>
            <span className={styles.sortButtonTitle}>勉強時間</span>
            <button
              className={`${styles.sortButton} ${activeSortButton === "studyMinutesAsc" ? styles.active : ""}`}
              onClick={() => onSort("studyMinutesAsc")}
              >
              少ない順
            </button>
            <button
              className={`${styles.sortButton} ${activeSortButton === "studyMinutesDesc" ? styles.active : ""}`}
              onClick={() => onSort("studyMinutesDesc")}
              >
              多い順
            </button>
          </div>

          <div className={styles.sortButtonGroup}>
            <span className={styles.sortButtonTitle}>ハピネススコア</span>
            <button
              className={`${styles.sortButton} ${activeSortButton === "scoreAsc" ? styles.active : ""}`}
              onClick={() => onSort("scoreAsc")}
              >
              低い順
            </button>
            <button
              className={`${styles.sortButton} ${activeSortButton === "scoreDesc" ? styles.active : ""}`}
              onClick={() => onSort("scoreDesc")}
              >
              高い順
            </button>
          </div>
        </>
      ) : (
        <div className={styles.sortButtonGroup}>
          <span className={styles.sortButtonTitle}>実務経験月数</span>

          <button
            className={`${styles.sortButton} ${activeSortButton === "experienceDaysAsc" ? styles.active : ""}`}
            onClick={() => onSort("experienceDaysAsc")}
            >
            少ない順
          </button>
          <button
            className={`${styles.sortButton} ${activeSortButton === "experienceDaysDesc" ? styles.active : ""}`}
            onClick={() => onSort("experienceDaysDesc")}
            >
            多い順
          </button>
        </div>
      )}
    </div>
  )
};
