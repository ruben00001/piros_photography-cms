/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Empty from "./Empty";
import Populated from "./Populated";

const PageContent = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return (
    <div className="pt-xl">
      {!allAlbums!.length ? <Empty /> : <Populated />}
    </div>
  );
};

export default PageContent;
