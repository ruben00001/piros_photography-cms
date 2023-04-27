import { AddFirstAlbumIcon } from "~/components/ui-elements";
import AddImageButton from "../AddImage";

const Unpopulated = () => {
  return (
    <div className="mt-xl grid place-items-center">
      <div className="mb-xs text-4xl text-gray-300">
        <AddFirstAlbumIcon weight="light" />
      </div>
      <h5 className="font-bold">No images</h5>
      <p className="mt-xs mb-sm text-gray-500">Add first image</p>
      <AddImageButton />
    </div>
  );
};

export default Unpopulated;
