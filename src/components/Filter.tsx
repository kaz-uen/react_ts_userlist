import styles from "./Filter.module.scss";

type FilterProps = {
  label: string;
  id: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
};

/**
 * フィルターコンポーネント
 */
export default function Filter({
  label,
  id,
  value,
  onChange,
  options
}: FilterProps): JSX.Element {
  return (
    <div className={styles.filterSection}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">未選択</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
};
