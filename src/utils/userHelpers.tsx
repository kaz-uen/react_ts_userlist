import type { User } from "@/types/userList";

/**
 * 対応可能なメンター名を取得する関数
 */
export const getAvailableMentors = (
  taskCode: number | undefined,
  mentors: User[]
): string => {
  if (!taskCode) return "";

  return mentors
    .filter(mentor =>
      mentor.availableStartCode &&
      mentor.availableEndCode &&
      taskCode >= mentor.availableStartCode &&
      taskCode <= mentor.availableEndCode
    )
    .map(mentor => mentor.name)
    .join(",");
};

/**
 * 担当可能な生徒名を取得する関数
 */
export const getAvailableStudents = (
  availableStartCode: number | undefined,
  availableEndCode: number | undefined,
  students: User[]
): string => {
  if (!availableStartCode || !availableEndCode) return "";

  return students
    .filter(student =>
      student.taskCode &&
      availableStartCode <= student.taskCode &&
      availableEndCode >= student.taskCode
    )
    .map(student => student.name)
    .join(",");
};

export const getCellContent = (
  column: string,
  user: User,
  mentors?: User[],
  students?: User[]
): string => {
  if (column === "availableMentors" && mentors) {
    return getAvailableMentors(user.taskCode, mentors);
  }

  if (column === "availableStudents" && students) {
    return getAvailableStudents(
      user.availableStartCode,
      user.availableEndCode,
      students
    );
  }

  const value = user[column as keyof User];
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value?.toString() ?? "";
};
