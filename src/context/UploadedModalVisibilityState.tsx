import { createContext, type ReactElement, useContext, useState } from "react";

type UploadedModalVisibilityState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const Context = createContext<UploadedModalVisibilityState | null>(null);

const Provider = ({
  children,
}: {
  children:
    | ReactElement
    | ((args: UploadedModalVisibilityState) => ReactElement);
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const value: UploadedModalVisibilityState = { isOpen, openModal, closeModal };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      "useUploadedModalVisibilityContext must be used within its provider!"
    );
  }

  return context;
};

export {
  Provider as UploadedModalVisibilityProvider,
  useThisContext as useUploadedModalVisibilityContext,
};
