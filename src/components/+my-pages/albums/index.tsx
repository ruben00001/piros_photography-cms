import PageDataFetchInit from "./PageDataFetchInit";
import OnDataFetchSuccess from "./on-data-fetch-success";

const AlbumsPage = () => {
  return (
    <PageDataFetchInit>
      <OnDataFetchSuccess />
    </PageDataFetchInit>
  );
};

export default AlbumsPage;
