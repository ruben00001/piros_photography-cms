import { type ReactElement } from "react";

import { api } from "~/utils/api";

export default function PageDataFetchInit({
  children,
}: {
  children: ReactElement;
}) {
  return <FetchAlbumsWrapper>{children}</FetchAlbumsWrapper>;
}

const FetchAlbumsWrapper = ({ children }: { children: ReactElement }) => {
  const {
    isInitialLoading: isInitialLoadingGetAlbums,
    isError: isGetAlbumsError,
  } = api.album.albumsPageGetAll.useQuery();
  const {
    isInitialLoading: isInitialLoadingPageText,
    isError: isGetPageTextError,
  } = api.albumsPage.getText.useQuery();

  if (isInitialLoadingGetAlbums || isInitialLoadingPageText) {
    return (
      <div className="my-screen-center z-50 bg-white/60">
        <p className="font-mono">Loading...</p>
      </div>
    );
  }

  if (isGetAlbumsError || isGetPageTextError) {
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
