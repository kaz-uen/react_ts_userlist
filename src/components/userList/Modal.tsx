import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "@/features/UserSlice";
import { closeModal } from "@/features/ModalSlice";
import type { UserRole, User, UserFormData } from "@/types/userList";
import { AppDispatch } from "@/store/Index";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import styles from "@/components/userList/Modal.module.scss";

/**
 * ユーザー追加モーダル
 */
export default function ModalComponent(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [userData, setUserData] = useState<UserFormData>({
    name: "",
    email: "",
    age: "",
    postCode: "",
    phone: "",
    hobbies: "",
    url: "",
    studyMinutes: "",
    taskCode: "",
    studyLangs: "",
    score: "",
    experienceDays: "",
    useLangs: "",
    availableStartCode: "",
    availableEndCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }))
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUserData: Omit<User, "id"> = {
      name: userData.name,
      role: selectedRole,
      email: userData.email,
      age: Number(userData.age),
      postCode: userData.postCode,
      phone: userData.phone,
      hobbies: userData.hobbies.split(','),
      url: userData.url,
      ...(selectedRole === "student" && {
        studyMinutes: Number(userData.studyMinutes),
        taskCode: Number(userData.taskCode),
        studyLangs: userData.studyLangs.split(','),
        score: Number(userData.score)
      }),
      ...(selectedRole === "mentor" && {
        experienceDays: Number(userData.experienceDays),
        useLangs: userData.useLangs.split(','),
        availableStartCode: Number(userData.availableStartCode),
        availableEndCode: Number(userData.availableEndCode)
      }),
    };

    dispatch(addUser(newUserData));

    // フォームをリセット
    setUserData({
      name: "",
      email: "",
      age: "",
      postCode: "",
      phone: "",
      hobbies: "",
      url: "",
      studyMinutes: "",
      taskCode: "",
      studyLangs: "",
      score: "",
      experienceDays: "",
      useLangs: "",
      availableStartCode: "",
      availableEndCode: ""
    });

    // モーダルを閉じる
    dispatch(closeModal());
  };

  return (
    <Modal onClose={() => dispatch(closeModal())}>
      <h2 className={styles.title}>新規ユーザー登録</h2>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="userRoleSelect">ユーザーロール</label>
        <select
          className={styles.select}
          id="userRoleSelect"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
        >
          <option value="student">生徒</option>
          <option value="mentor">メンター</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="名前"
          id="name"
          type="text"
          value={userData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="メール"
          id="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="年齢"
          id="age"
          type="number"
          value={userData.age}
          onChange={handleChange}
          required
        />

        {/* 共通フィールド */}
        <Input
          label="郵便番号"
          id="postCode"
          type="text"
          value={userData.postCode}
          onChange={handleChange}
          required
        />
        <Input
          label="電話番号"
          id="phone"
          type="tel"
          value={userData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="趣味（カンマ区切り）"
          id="hobbies"
          type="text"
          value={userData.hobbies}
          onChange={handleChange}
          required
        />
        <Input
          label="URL"
          id="url"
          type="url"
          value={userData.url}
          onChange={handleChange}
          required
        />

        {/* 生徒ロール特有のフィールド */}
        {selectedRole === "student" && (
          <>
            <Input
              label="学習時間（分）"
              id="studyMinutes"
              type="number"
              value={userData.studyMinutes}
              onChange={handleChange}
              required
            />
            <Input
              label="タスクコード"
              id="taskCode"
              type="number"
              value={userData.taskCode}
              onChange={handleChange}
              required
            />
            <Input
              label="学習言語（カンマ区切り）"
              id="studyLangs"
              type="text"
              value={userData.studyLangs}
              onChange={handleChange}
              required
            />
            <Input
              label="スコア"
              id="score"
              type="number"
              value={userData.score}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* メンターロール特有のフィールド */}
        {selectedRole === "mentor" && (
          <>
            <Input
              label="経験日数"
              id="experienceDays"
              type="number"
              value={userData.experienceDays}
              onChange={handleChange}
              required
            />
            <Input
              label="使用言語（カンマ区切り）"
              id="useLangs"
              type="text"
              value={userData.useLangs}
              onChange={handleChange}
              required
            />
            <Input
              label="開始可能コード"
              id="availableStartCode"
              type="number"
              value={userData.availableStartCode}
              onChange={handleChange}
              required
            />
            <Input
              label="終了可能コード"
              id="availableEndCode"
              type="number"
              value={userData.availableEndCode}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button className={styles.submitButton} type="submit">追加する</button>
      </form>
    </Modal>
  )
};
