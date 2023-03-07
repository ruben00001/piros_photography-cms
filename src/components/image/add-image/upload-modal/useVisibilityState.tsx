import { createContext, type ReactElement, useContext } from "react";
import { createStore, useStore } from "zustand";

type ModalVisibilityState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const store = createStore<ModalVisibilityState>()((set) => ({
  isOpen: false,

  openModal: () => set(() => ({ isOpen: true })),

  closeModal: () => set(() => ({ isOpen: false })),
}));

const MyContext = createContext<typeof store>({} as typeof store);

export const ModalVisibilityProvider = ({
  children,
}: {
  children: ReactElement;
}) => <MyContext.Provider value={store}>{children}</MyContext.Provider>;

export const useModalVisibilityStore = (
  selector: (state: ModalVisibilityState) => ModalVisibilityState
) => useStore(useContext(MyContext), selector);
