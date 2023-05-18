/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Layout from "~/components/layouts";
import AddAlbum from "./AddAlbum";
import Populated from "./populated/+Entry";
import Unpopulated from "./unpopulated/+Entry";

const OnDataFetchSuccess = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return (
    <Layout.ContentBody maxWidth={1800}>
      <div className="p-lg">
        <div className="mt-lg max-w-[400px]">
          <AddAlbum />
        </div>
        <div className="mt-lg">
          {allAlbums!.length ? <Populated /> : <Unpopulated />}
        </div>
      </div>
    </Layout.ContentBody>
  );
};

export default OnDataFetchSuccess;
