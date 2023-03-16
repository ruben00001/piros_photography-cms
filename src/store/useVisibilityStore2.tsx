import { createContext, type ReactElement, useContext, useState } from "react";

type VisibilityState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const MyContext = createContext<VisibilityState | null>(null);

export const ModalVisibilityProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const value: VisibilityState = {
    isOpen,
    close() {
      setIsOpen(false);
    },
    open() {
      setIsOpen(true);
    },
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export const useModalVisibilityStore = () => {
  const value = useContext(MyContext);
  if (!value) {
    throw new Error("Missing Provider");
  }
  return value;
};
