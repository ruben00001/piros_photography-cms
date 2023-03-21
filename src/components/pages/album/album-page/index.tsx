import OnDataFetchSuccess from "./on-data-fetch-success";
import PageDataFetchInit from "./PageDataFetchInit";

const AlbumPage = () => {
  return (
    <PageDataFetchInit>
      {({ album }) => <OnDataFetchSuccess album={album} />}
    </PageDataFetchInit>
  );
};

export default AlbumPage;
