import UserListComponent from "@/components/userList/Index";
import ModalComponent from "@/components/userList/Modal";
import { useSelector } from "@/store/Index";

/**
 * ユーザーリストコンテナ
 */
export default function UserList() {
  const { isOpen } = useSelector((state) => state.modal);

  return (
    <>
      {isOpen && <ModalComponent />}
      <UserListComponent />
    </>
  )
}
