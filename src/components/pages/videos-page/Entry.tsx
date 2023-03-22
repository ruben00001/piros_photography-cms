import OnDataFetchSuccess from "./on-data-fetch-success/Entry";
import PageDataFetchInit from "./PageDataFetchInit";

const Entry = () => {
  return (
    <PageDataFetchInit>
      <OnDataFetchSuccess />
    </PageDataFetchInit>
  );
};

export default Entry;
