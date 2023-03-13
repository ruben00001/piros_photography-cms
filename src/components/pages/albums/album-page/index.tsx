// crud image
// title

import UploadModal from "~/components/image/add-image/upload-modal";
import UploadedModal from "~/components/image/add-image/uploaded-modal";
import { UploadedModalVisibilityProvider } from "~/context/UploadedModalVisibilityState";
import { UploadModalVisibilityProvider } from "~/context/UploadModalVisibilityState";
import MetaPanel from "./MetaPanel";

// album image: title, desc.

const AlbumPageContent = () => {
  return (
    <UploadModalVisibilityProvider>
      <UploadedModalVisibilityProvider>
        <>
          <div>
            <MetaPanel />
          </div>
          <UploadedModal onSelectImage={() => null} />
          <UploadModal createDbImageFunc={() => null} />
        </>
      </UploadedModalVisibilityProvider>
    </UploadModalVisibilityProvider>
  );
};

export default AlbumPageContent;
