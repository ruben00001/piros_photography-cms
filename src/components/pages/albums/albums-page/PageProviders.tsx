import { type ReactElement } from "react";

import { UploadModalVisibilityProvider } from "~/context/UploadModalVisibilityState";
import { UploadedModalVisibilityProvider } from "~/context/UploadedModalVisibilityState";
import { AlbumsProvider } from "./_context/AlbumsState";
import { WarningModalProvider } from "~/components/warning-modal/Context";

const PageProviders = ({ children }: { children: ReactElement }) => {
  return (
    <UploadModalVisibilityProvider>
      <UploadedModalVisibilityProvider>
        <AlbumsProvider>
          {({ setActiveAlbum: setActiveAlbumId }) => (
            <WarningModalProvider onClose={() => setActiveAlbumId(null)}>
              {children}
            </WarningModalProvider>
          )}
        </AlbumsProvider>
      </UploadedModalVisibilityProvider>
    </UploadModalVisibilityProvider>
  );
};

export default PageProviders;
