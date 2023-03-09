import { createContext, type ReactElement, useContext } from "react";
import { createStore, useStore } from "zustand";

type ModalVisibilityState = {
  isOpen: boolean;
  openModal: (arg0?: { onOpen: () => void }) => void;
  closeModal: (arg0?: { onClose: () => void }) => void;
};

const store = createStore<ModalVisibilityState>()((set) => ({
  isOpen: false,

  openModal: (arg0) => {
    set(() => ({ isOpen: true }));
    if (arg0) {
      console.log("ON OPEN");

      arg0.onOpen();
    }
  },

  closeModal: (arg0) => {
    set(() => ({ isOpen: false }));
    arg0 && arg0.onClose();
  },
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
