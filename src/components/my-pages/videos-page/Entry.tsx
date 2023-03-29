import PageDataFetchInit from "./PageDataFetchInit";
import OnDataFetchSuccess from "./on-data-fetch-success/Entry";

const Entry = () => {
  return (
    <PageDataFetchInit>
      <OnDataFetchSuccess />
    </PageDataFetchInit>
  );
};

export default Entry;
