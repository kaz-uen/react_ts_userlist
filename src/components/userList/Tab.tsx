import type { TabType } from "@/types/userList";
import styles from "./Tab.module.scss";

const tabs: { id: TabType; label: string }[] = [
  { id: "all", label: "全員" },
  { id: "student", label: "生徒" },
  { id: "mentor", label: "メンター" },
];

type TabProps = {
  activeTab: TabType;
  onTabClick: (tab: TabType) => void;
};

/**
 * タブ
 */
export default function Tab({
  activeTab,
  onTabClick
}: TabProps): JSX.Element {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
};
