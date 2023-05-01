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
        <div className="mt-lg">
          {!allAlbums!.length ? <Empty /> : <Populated />}
        </div>
      </div>
    </Layout.ContentBody>
  );
};

export default OnDataFetchSuccess;
