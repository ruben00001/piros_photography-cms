import { api } from "~/utils/api";
import { PageDataInit } from "~/components/ui-written";
import OnDataFetchSuccess from "./on-data-fetch-success/Entry";

const Entry = () => {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.image.imagesPageGetAll.useQuery();

  return (
    <PageDataInit
      isError={isFetchedAfterMount && isError}
      isLoading={isInitialLoading}
    >
      <OnDataFetchSuccess />
    </PageDataInit>
  );
};

export default Entry;
