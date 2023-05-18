import { AddFirstAlbumIcon } from "~/components/ui-elements";

// □ refactor: is same as videos page - can make into a layout.

const Empty = () => (
  <div className="grid place-items-center">
    <div className="mb-xs text-4xl text-gray-300">
      <AddFirstAlbumIcon weight="light" />
    </div>
    <h5 className="font-bold">No albums</h5>
    <p className="mt-xs mb-sm text-gray-500">Create first album</p>
  </div>
);

export default Empty;
