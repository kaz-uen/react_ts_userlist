import styles from "@/components/Button.module.scss";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * ボタンコンポーネント
 */
export default function Button({
  type = "button",
  onClick,
  children
}: ButtonProps): JSX.Element {
  return (
    <button
      className={styles.button}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
};
