/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import Empty from "./unpopulated";
import Populated from "./populated";

const PageContent = () => {
  const { data: allAlbums } = api.album.albumsPageGetAll.useQuery();

  return <div>{!allAlbums!.length ? <Empty /> : <Populated />}</div>;
};

export default PageContent;
