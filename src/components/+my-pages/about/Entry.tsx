import { api } from "~/utils/api";
import { PageDataInit } from "~/components/ui-written";
import OnDataFetchSuccess from "./on-data-fetch-success/Entry";

const Entry = () => {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.aboutPage.getText.useQuery();

  return (
    <PageDataInit
      isLoading={isInitialLoading}
      isError={isFetchedAfterMount && isError}
    >
      <OnDataFetchSuccess />
    </PageDataInit>
  );
};

export default Entry;
