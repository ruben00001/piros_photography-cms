import AddAlbumImageButton from "./AddAlbumImage";
import AlbumBody from "./body";
import MetaPanel from "./MetaPanel";

const PageContent = () => {
  return (
    <div className="p-xl">
      <MetaPanel />
      <div className="mt-xl">
        <AddAlbumImageButton />
      </div>
      <div className="mt-lg">
        <AlbumBody />
      </div>
    </div>
  );
};

export default PageContent;
