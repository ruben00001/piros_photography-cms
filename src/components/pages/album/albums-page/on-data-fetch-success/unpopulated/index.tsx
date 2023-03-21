import { AddFirstAlbumIcon } from "~/components/Icon";
import AddAlbum from "./AddAlbum";

const Empty = () => {
  return (
    <div className="grid place-items-center">
      <div className="mb-xs text-4xl text-gray-300">
        <AddFirstAlbumIcon weight="light" />
      </div>
      <h5 className="font-bold">No albums</h5>
      <p className="mt-xs mb-sm text-gray-500">Create first album</p>
      <AddAlbum />
    </div>
  );
};

export default Empty;
