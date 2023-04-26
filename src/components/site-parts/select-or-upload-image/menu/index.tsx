import { type ReactElement } from "react";

import { MyMenu, MyModal } from "~/components/ui-display";
import { ImageIcon, UploadIcon } from "~/components/ui-elements/Icon";
import { ImageModalsVisibilityProvider } from "../ImageModalsVisibiltyContext";
import { UploadPanelContent, type OnUploadImage } from "../UploadPanelContent";
import {
  UploadedPanelContent,
  type OnSelectImage,
} from "../UploadedPanelContent";

export const SelectOrUploadImageMenu = ({
  button,
  uploadPanel,
  uploadedPanel,
  styles,
}: {
  button: ReactElement | ((arg0: { isOpen: boolean }) => ReactElement);
  uploadPanel: { onUploadImage: OnUploadImage };
  uploadedPanel: { onSelectImage: OnSelectImage };
  styles?: { buttonWrapper?: string; itemsWrapper?: string };
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

            <MyModal.Default
              isOpen={uploadModal.isOpen}
              closeModal={uploadModal.close}
            >
              <UploadPanelContent
                closeModal={uploadModal.close}
                onUploadImage={uploadPanel.onUploadImage}
              />
            </MyModal.Default>

            <MyModal.Default
              isOpen={uploadedModal.isOpen}
              closeModal={uploadedModal.close}
            >
              <UploadedPanelContent
                closeModal={uploadedModal.close}
                onSelectImage={uploadedPanel.onSelectImage}
              />
            </MyModal.Default>
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
}) => (
  <MyMenu.Item>
    <div
      className={`group flex w-full cursor-pointer items-center gap-4 rounded-md px-2 py-2 pr-md text-sm hover:bg-base-200`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <span>{icon}</span>
        <span className="whitespace-nowrap">{text}</span>
      </div>
    </div>
  </MyMenu.Item>
);
