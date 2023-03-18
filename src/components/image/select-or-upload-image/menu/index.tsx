import { type ReactElement } from "react";

import { ImageIcon, UploadIcon } from "~/components/Icon";
import { ModalPanelWrapper } from "~/components/modal/PanelWrapper";
import MyMenu, { MenuItem } from "~/components/MyMenu";
import { ImageModalsVisibilityProvider } from "../ImageModalsVisibiltyContext";
import UploadedPanelContent, {
  type OnSelectImage,
} from "../UploadedPanelContent";
import UploadPanelContent, { type OnUploadImage } from "../UploadPanelContent";

export const SelectOrUploadImageMenu = ({
  button,
  uploadPanel,
  uploadedPanel,
  styles,
}: {
  button: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  uploadPanel: { onUploadImage: OnUploadImage };
  uploadedPanel: { onSelectImage: OnSelectImage };
  styles?: { buttonWrapper?: string };
}) => {
  return (
    <>
      <ImageModalsVisibilityProvider>
        {({ uploadModal, uploadedModal }) => (
          <>
            <MyMenu button={button} styles={styles}>
              <ImageModalButton
                icon={<ImageIcon />}
                onClick={uploadedModal.open}
                text="Use uploaded"
              />
              <ImageModalButton
                icon={<UploadIcon />}
                onClick={uploadModal.open}
                text="Upload new"
              />
            </MyMenu>

            <ModalPanelWrapper
              isOpen={uploadModal.isOpen}
              closeModal={uploadModal.close}
            >
              <UploadPanelContent
                closeModal={uploadModal.close}
                onUploadImage={uploadPanel.onUploadImage}
              />
            </ModalPanelWrapper>

            <ModalPanelWrapper
              isOpen={uploadedModal.isOpen}
              closeModal={uploadedModal.close}
            >
              <UploadedPanelContent
                closeModal={uploadedModal.close}
                onSelectImage={uploadedPanel.onSelectImage}
              />
            </ModalPanelWrapper>
          </>
        )}
      </ImageModalsVisibilityProvider>
    </>
  );
};

const ImageModalButton = ({
  onClick,
  icon,
  text,
}: {
  icon: ReactElement;
  text: string;
  onClick: () => void;
}) => {
  return (
    <MenuItem>
      <div
        className={`group flex w-full cursor-pointer items-center gap-4 rounded-md px-2 py-2 pr-md text-sm hover:bg-base-200`}
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <span>{icon}</span>
          <span>{text}</span>
        </div>
      </div>
    </MenuItem>
  );
};
