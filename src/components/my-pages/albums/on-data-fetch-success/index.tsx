/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import { ContentBodyLayout } from "~/components/layout";
import Populated from "./populated";
import Empty from "./unpopulated";

const OnDataFetchSuccess = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return (
    <ContentBodyLayout maxWidth={1800}>
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
    </ContentBodyLayout>
  );
};

export default OnDataFetchSuccess;
