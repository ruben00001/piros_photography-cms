import PageDataFetchInit from "./PageDataFetchInit";
import OnDataFetchSuccess from "./on-data-fetch-success";

const AlbumPage = () => {
  return (
    <PageDataFetchInit>
      {({ album }) => <OnDataFetchSuccess album={album} />}
    </PageDataFetchInit>
  );
};

export default AlbumPage;
