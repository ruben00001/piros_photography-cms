import { type ReactElement } from "react";

import { api } from "~/utils/api";

export default function PageDataFetchInit({
  children,
}: {
  children: ReactElement;
}) {
  return <FetchImagesWrapper>{children}</FetchImagesWrapper>;
}

const FetchImagesWrapper = ({ children }: { children: ReactElement }) => {
  const { isFetchedAfterMount, isInitialLoading, isError } =
    api.image.getAll.useQuery();

  if (isInitialLoading) {
    return (
      <div className="my-screen-center">
        <p className="font-mono">Loading...</p>
      </div>
    );
  }

  if (isFetchedAfterMount && isError) {
    return (
      <div className="my-screen-center">
        <div className="max-w-xl">
          <h3 className="font-medium">Something went wrong</h3>
          <p className="mt-xs text-gray-600">
            Try refreshing the page. If the problem persists and it&apos;s not
            to do with the internet, contact the developer.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
