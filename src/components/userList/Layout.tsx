import type { ReactNode } from "react";
import styles from "./Layout.module.scss";

type LayoutProps = {
  header: ReactNode;
  content: ReactNode;
};

/**
 * ユーザー一覧レイアウト
 */
export default function Layout({
  header,
  content
}: LayoutProps): JSX.Element {
  return (
    <>
      <div className={styles.header}>
        {header}
      </div>

      {content}
    </>
  )
};
