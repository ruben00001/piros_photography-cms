import UploadPanel from "~/components/image/add-image/upload-modal";
import Albums from "./albums";
import AddAlbumModal from "./albums/AddAlbumModal";

const PageContent = () => {
  return (
    <>
      <div className="p-md">
        <div className="mt-8">
          <Albums />
        </div>
      </div>
      <Modals />
    </>
  );
};

export default PageContent;

const Modals = () => {
  return (
    <>
      <AddAlbumModal />
    </>
  );
};
