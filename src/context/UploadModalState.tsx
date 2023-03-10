import { createContext, type ReactElement, useContext } from "react";

export type ModalState = {
  createDbImageFunc: (arg0: {
    cloudinary_public_id: string;
    tagIds?: string[];
    onSuccess: () => void;
  }) => void;
};

const MyContext = createContext<ModalState | null>(null);

export const UploadModalProvider = ({
  children,
  createDbImageFunc,
}: {
  children: ReactElement | ((args: ModalState) => ReactElement);
  createDbImageFunc: ModalState["createDbImageFunc"];
}) => {
  const value: ModalState = {
    createDbImageFunc,
  };

  return (
    <MyContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </MyContext.Provider>
  );
};

export const useUploadModalContext = () => {
  const value = useContext(MyContext);
  if (!value) {
    throw new Error("Missing UploadModal Provider");
  }

  return value;
};
