import { type ReactElement } from "react";

import { UploadModalVisibilityProvider } from "~/components/image/select-or-upload-image/upload-modal";
import { UploadedModalVisibilityProvider } from "~/components/image/select-or-upload-image/uploaded-modal";
import { WarningModalProvider } from "~/components/warning-modal";
import { AlbumProvider } from "./_context/AlbumState";
import { ImageTypeProvider } from "./_context/ImageType";
import { type Album } from "./_types";

const ProvidersInit = ({
  children,
  album,
}: {
  children: ReactElement;
  album: Album;
}) => {
  return (
    <AlbumProvider album={album}>
      <ImageTypeProvider>
        {({ setImageContext }) => (
          <UploadModalVisibilityProvider onClose={() => setImageContext(null)}>
            <UploadedModalVisibilityProvider
              onClose={() => setImageContext(null)}
            >
              <WarningModalProvider>{children}</WarningModalProvider>
            </UploadedModalVisibilityProvider>
          </UploadModalVisibilityProvider>
        )}
      </ImageTypeProvider>
    </AlbumProvider>
  );
};

export default ProvidersInit;
