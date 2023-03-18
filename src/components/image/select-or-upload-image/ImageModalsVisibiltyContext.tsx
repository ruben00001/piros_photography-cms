import { createContext, type ReactElement, useContext, useState } from "react";

type VisibilityState = {
  uploadedModal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  uploadModal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
};

const MyContext = createContext<VisibilityState | null>(null);

export const ImageModalsVisibilityProvider = ({
  children,
}: {
  children: ReactElement | ((args: VisibilityState) => ReactElement);
}) => {
  const [uploadedIsOpen, setUploadedIsOpen] = useState(false);
  const [uploadIsOpen, setUploadIsOpen] = useState(false);

  const value: VisibilityState = {
    uploadedModal: {
      isOpen: uploadedIsOpen,
      close() {
        setUploadedIsOpen(false);
      },
      open() {
        setUploadedIsOpen(true);
      },
    },
    uploadModal: {
      isOpen: uploadIsOpen,
      close() {
        setUploadIsOpen(false);
      },
      open() {
        setUploadIsOpen(true);
      },
    },
  };

  return (
    <MyContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </MyContext.Provider>
  );
};

export const useImageModalsVisibilityContext = () => {
  const value = useContext(MyContext);
  if (!value) {
    throw new Error("Missing Image Modals Visibility Provider");
  }
  return value;
};
