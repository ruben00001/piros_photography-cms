import OnDataFetchSuccess from "./on-data-fetch-success";
import PageDataFetchInit from "./PageDataFetchInit";

const AlbumsPage = () => {
  return (
    <PageDataFetchInit>
      <OnDataFetchSuccess />
    </PageDataFetchInit>
  );
};

export default AlbumsPage;
