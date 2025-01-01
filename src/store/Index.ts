import { useSelector as rawUseSelector, TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/UserSlice";
import modalReducer from "@/features/ModalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;

export type AppDispatch = typeof store.dispatch;
