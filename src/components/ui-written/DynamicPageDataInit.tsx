import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { MyToast } from "../ui-display";
import { MySpinner } from "../ui-elements";

export const DynamicPageDataInit = ({
  children,
  isLoading,
  isError,
  isDocument,
  redirectTo,
}: {
  children: ReactElement;
  isLoading: boolean;
  isError: boolean;
  isDocument: boolean;
  redirectTo: string;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isDocument) {
      return;
    }

    toast(<MyToast text="Page doesn't exist. Redirecting..." type="error" />);

    setTimeout(() => {
      void router.push(redirectTo);
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isDocument]);

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

  if (!isDocument) {
    return (
      <div className="my-screen-center">
        <div className="max-w-xl">
          <h3 className="font-medium">That page doesn&apos;t exist</h3>
          <p className="mt-xs text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
};
