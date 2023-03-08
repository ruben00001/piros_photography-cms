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

const MyContext = createContext<typeof store | null>(null);

export const UploadedModalVisibilityProvider = ({
  children,
}: {
  children: ReactElement | ((args: ModalVisibilityState) => ReactElement);
}) => {
  const myStore = useStore(store);

  return (
    <MyContext.Provider value={store}>
      {typeof children === "function" ? children(myStore) : children}
    </MyContext.Provider>
  );
};

// export const useUploadedModalVisibilityStore = <T,>(
// selector: (state: ModalVisibilityState) => T
export const useUploadedModalVisibilityStore = () => {
  const store = useContext(MyContext);
  if (!store) {
    throw new Error("Missing UploadedModalVisibility Provider");
  }
  return useStore(store);
};
