import { type ReactElement } from "react";
import { UploadModalVisibilityProvider } from "~/components/image/add-image/upload-modal";
import { UploadedModalVisibilityProvider } from "~/components/image/add-image/uploaded-modal";
import { AlbumProvider, Album } from "./_context/AlbumState";
import { ImageTypeProvider } from "./_context/ImageType";

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
              {children}
            </UploadedModalVisibilityProvider>
          </UploadModalVisibilityProvider>
        )}
      </ImageTypeProvider>
    </AlbumProvider>
  );
};

export default ProvidersInit;
