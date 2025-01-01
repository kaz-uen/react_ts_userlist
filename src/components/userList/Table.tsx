import type { User } from "@/types/userList";
import { getCellContent } from "@/utils/userHelpers";
import { columnLabels } from "@/utils/userListLabel";
import styles from "./Table.module.scss";

type TableProps = {
  users: User[];
  columns: (keyof User | "availableMentors" | "availableStudents")[];
  mentors?: User[];
  students?: User[];
};

/**
 * ユーザーリストテーブル
 */
export default function Table({
  users,
  columns,
  mentors,
  students
}: TableProps): JSX.Element {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column === "availableMentors"
                  ? "対応可能なメンター"
                  : column === "availableStudents"
                    ? "対応可能な生徒"
                    : columnLabels[column as keyof User]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {columns.map((column) => (
                <td key={column}>
                  {getCellContent(column, user, mentors, students)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};
