import styles from "@/components/Modal.module.scss";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * モーダルコンポーネント
 */
export default function Modal({
  onClose,
  children,
}: ModalProps): JSX.Element {
  return (
    <aside className={styles.modal}>
      <div className={styles.modalContainer}>
        <button
          className={styles.closeButton}
          type="button"
          onClick={onClose}
          aria-label="モーダルを閉じる"
        >
        ×
        </button>
        {children}
      </div>
    </aside>
  )
};
