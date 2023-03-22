import { AddFirstAlbumIcon } from "~/components/Icon";
import AddVideo from "../AddVideo";

const Unpopulated = () => {
  return (
    <div className="grid place-items-center">
      <div className="mb-xs text-4xl text-gray-300">
        <AddFirstAlbumIcon weight="light" />
      </div>
      <h5 className="font-bold">No videos</h5>
      <p className="mt-xs mb-sm text-gray-500">Add first video</p>
      <AddVideo />
    </div>
  );
};

export default Unpopulated;
