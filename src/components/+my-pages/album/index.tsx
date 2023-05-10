/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { api } from "~/utils/api";
import { DynamicPageDataInit } from "~/components/ui-written";
import useDynamicRouteParams from "~/hooks/useDynamicRouteParams";
import OnDataFetchSuccess from "./on-data-fetch-success";

const AlbumPage = () => {
  const params = useDynamicRouteParams();

  const albumId = typeof params === "object" && params.idParam;

  const {
    data: album,
    isFetched,
    isError: isFetchError,
  } = api.album.albumPageGetOne.useQuery(
    {
      albumId: albumId || "",
    },
    { enabled: Boolean(albumId) },
  );

  const isLoading = params === "pending" || !isFetched;

  return (
    <DynamicPageDataInit
      isDocument={Boolean(album)}
      isLoading={isLoading}
      isError={isFetchError}
      redirectTo="/albums"
    >
      <OnDataFetchSuccess album={album!} />
    </DynamicPageDataInit>
  );
};

export default AlbumPage;
