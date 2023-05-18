import { api } from "~/utils/api";
import { PageDataInit } from "~/components/ui-written";
import OnDataFetchSuccess from "./on-data-fetch-success/+Entry";

const AlbumsPage = () => {
  const {
    isInitialLoading: isInitialLoadingGetAlbums,
    isError: isGetAlbumsError,
  } = api.album.albumsPageGetAll.useQuery();
  const {
    isInitialLoading: isInitialLoadingPageText,
    isError: isGetPageTextError,
  } = api.albumsPage.getText.useQuery();

  return (
    <PageDataInit
      isError={isGetAlbumsError || isGetPageTextError}
      isLoading={isInitialLoadingGetAlbums || isInitialLoadingPageText}
    >
      <OnDataFetchSuccess />
    </PageDataInit>
  );
};

export default AlbumsPage;
