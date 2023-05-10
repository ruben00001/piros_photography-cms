import { type ReactElement } from "react";

import { MySpinner } from "../ui-elements";

export const PageDataInit = ({
  children,
  isLoading,
  isError,
}: {
  children: ReactElement;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="my-screen-center bg-white/60">
        <div className="flex flex-col items-center gap-md">
          <MySpinner />
          <p className="font-mono">Loading data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-screen-center">
        <div className="max-w-xl">
          <h3 className="font-medium">
            Something went wrong fetching the data.
          </h3>
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
