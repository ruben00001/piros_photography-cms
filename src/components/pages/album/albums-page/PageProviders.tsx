import { type ReactElement } from "react";

import { AlbumsProvider } from "./_context/AlbumsState";
import { WarningModalProvider } from "~/components/warning-modal/Context";
import { UploadModalVisibilityProvider } from "~/components/image/add-image/upload-modal";
import { UploadedModalVisibilityProvider } from "~/components/image/add-image/uploaded-modal";

const PageProviders = ({ children }: { children: ReactElement }) => {
  return (
    <AlbumsProvider>
      {({ setActiveAlbum }) => (
        <UploadedModalVisibilityProvider onClose={() => setActiveAlbum(null)}>
          <UploadModalVisibilityProvider onClose={() => setActiveAlbum(null)}>
            <WarningModalProvider onClose={() => setActiveAlbum(null)}>
              {children}
            </WarningModalProvider>
          </UploadModalVisibilityProvider>
        </UploadedModalVisibilityProvider>
      )}
    </AlbumsProvider>
  );
};

export default PageProviders;
