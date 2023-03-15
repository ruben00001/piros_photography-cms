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

const MyContext = createContext<ModalVisibilityState | null>(null);

export const UploadedModalVisibilityProvider = ({
  children,
  onClose,
}: {
  children: ReactElement | ((args: ModalVisibilityState) => ReactElement);
  onClose?: () => void;
}) => {
  const myStore = useStore(store);

  const value: ModalVisibilityState = {
    closeModal: () => {
      onClose && onClose();
      myStore.closeModal();
    },
    isOpen: myStore.isOpen,
    openModal: myStore.openModal,
  };

  return (
    <MyContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </MyContext.Provider>
  );
};

export const useUploadedModalVisibilityContext = () => {
  const value = useContext(MyContext);

  if (!value) {
    throw new Error("Missing UploadedModalVisibility Provider");
  }

  return value;
};
