import { createContext, type ReactElement, useContext } from "react";
import { createStore, useStore } from "zustand";

type ModalVisibilityState = {
  isOpen: boolean;
  openModal: (arg0?: { onOpen: () => void }) => void;
  closeModal: () => void;
};

const store = createStore<ModalVisibilityState>()((set) => ({
  isOpen: false,

  openModal: (arg0) => {
    set(() => ({ isOpen: true }));
    if (arg0) {
      arg0.onOpen();
    }
  },

  closeModal: () => {
    set(() => ({ isOpen: false }));
  },
}));

const MyContext = createContext<typeof store | null>(null);

export const UploadModalVisibilityProvider = ({
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

export const useUploadModalVisibilityContext = () => {
  const store = useContext(MyContext);
  if (!store) {
    throw new Error("Missing UploadedModalVisibility Provider");
  }
  return useStore(store);
};
