/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";

import Empty from "./unpopulated";
import Populated from "./populated";

const OnDataFetchSuccess = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return (
    <div className="p-lg">
      <h1 className="text-xl text-gray-300">Albums Page</h1>
      <div>
        {!allAlbums!.length ? (
          <div className="mt-lg">
            <Empty />
          </div>
        ) : (
          <div className="mt-lg">
            <Populated />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnDataFetchSuccess;
