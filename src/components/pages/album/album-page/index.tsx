// crud image
// title

import PageContent from "./page-content";
import PageInit from "./PageInit";
import ProvidersInit from "./ProvidersInit";

// album image: title, desc.

const AlbumPage = () => {
  return (
    <PageInit>
      {({ album }) => (
        <ProvidersInit album={album}>
          <PageContent />
        </ProvidersInit>
      )}
    </PageInit>
  );
};

export default AlbumPage;
