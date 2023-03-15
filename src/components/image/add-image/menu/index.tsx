import { type ReactElement } from "react";

import { ImageIcon, UploadIcon } from "~/components/Icon";
import { useUploadModalVisibilityContext } from "../upload-modal";
import { useUploadedModalVisibilityContext } from "../uploaded-modal";
import MyMenu, { MenuItem as MenuItem_ } from "~/components/MyMenu";

const AddImageMenu = ({
  children,
  styles,
  imageModals,
}: {
  children: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  styles?: { buttonWrapper?: string };
  imageModals?: { onVisibilityChange?: { onOpen: () => void } };
}) => {
  const { openModal: openUploadedModal } = useUploadedModalVisibilityContext();
  const { openModal: openUploadModal } = useUploadModalVisibilityContext();

  return (
    <MyMenu button={children} styles={styles}>
      <MenuItem
        onClick={() => {
          openUploadedModal(imageModals?.onVisibilityChange);
        }}
      >
        <div className="flex items-center gap-4">
          <span>
            <ImageIcon />
          </span>
          <span>Use uploaded</span>
        </div>
      </MenuItem>
      <MenuItem
        onClick={() => openUploadModal(imageModals?.onVisibilityChange)}
      >
        <div className="flex items-center gap-4">
          <span>
            <UploadIcon />
          </span>
          <span>Upload new</span>
        </div>
      </MenuItem>
    </MyMenu>
  );
};

export default AddImageMenu;

const MenuItem = ({
  children,
  onClick,
}: {
  children: ReactElement | ReactElement[];
  onClick: () => void;
}) => {
  return (
    <MenuItem_>
      <div
        className={`group flex w-full cursor-pointer items-center gap-4 rounded-md px-2 py-2 pr-md text-sm hover:bg-base-200`}
        onClick={onClick}
      >
        {children}
      </div>
    </MenuItem_>
  );
};
