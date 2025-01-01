import { useDispatch } from "react-redux";
import { openModal } from "@/features/ModalSlice";
import Button from "@/components/Button";

/**
 * ユーザー追加ボタン
 */
export default function ButtonComponent(): JSX.Element {
  const dispatch = useDispatch();

  return <Button onClick={() => dispatch(openModal())}>＋ ユーザー追加</Button>
};
