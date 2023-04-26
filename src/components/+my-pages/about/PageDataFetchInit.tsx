import { type ReactElement } from "react";

import { api } from "~/utils/api";
import { DataErrorScreen, LoadingScreen } from "~/components/ui-written";

export default function PageDataFetchInit({
  children,
}: {
  children: ReactElement;
}) {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.aboutPage.getText.useQuery();

  if (isInitialLoading) {
    return <LoadingScreen text="Loading data..." showSpinner />;
  }

  if (isFetchedAfterMount && isError) {
    return <DataErrorScreen />;
  }

  return children;
}
