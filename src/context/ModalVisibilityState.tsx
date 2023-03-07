import { createContext, type ReactElement, useContext, useState } from "react";
import { checkObjectHasField } from "~/helpers/general";

type UploadModalVisibilityState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const Context = createContext<UploadModalVisibilityState>(
  {} as UploadModalVisibilityState
);

const Provider = ({
  children,
}: {
  children: ReactElement | ((args: UploadModalVisibilityState) => ReactElement);
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const value: UploadModalVisibilityState = { isOpen, openModal, closeModal };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

// should use zod for instead of checkObjectHasField?
const useThisContext = () => {
  const context = useContext(Context);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useModalVisibilityContext must be used within its provider!"
    );
  }

  return context;
};

export {
  Provider as ModalVisibilityProvider,
  useThisContext as useModalVisibilityContext,
};
