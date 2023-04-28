/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Layout from "~/components/layouts";
import Populated from "./populated";
import Empty from "./unpopulated";

const OnDataFetchSuccess = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return (
    <Layout.ContentBody maxWidth={1800}>
      <div className="p-lg">
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
    </Layout.ContentBody>
  );
};

export default OnDataFetchSuccess;
