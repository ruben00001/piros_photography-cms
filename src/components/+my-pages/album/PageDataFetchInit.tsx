import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { MyToast } from "~/components/ui-display";
import useDynamicRouteParams from "~/hooks/useDynamicRouteParams";
import { type Album } from "./_types";

export default function PageDataFetchInit({
  children,
}: {
  children: (arg0: { album: Album }) => ReactElement;
}) {
  return (
    <ParamsLoadWrapper>
      {(params) => (
        <IsParamsIdWrapper albumId={params.idParam}>
          {(albumId) => (
            <FetchAlbumWrapper albumId={albumId}>
              {(album) => children({ album })}
            </FetchAlbumWrapper>
          )}
        </IsParamsIdWrapper>
      )}
    </ParamsLoadWrapper>
  );
}

const ParamsLoadWrapper = ({
  children,
}: {
  children: (routeParams: { idParam: string | undefined }) => ReactElement;
}) => {
  const params = useDynamicRouteParams();

  if (params === "pending") {
    return (
      <div className="my-screen-center">
        <p>Loading...</p>
      </div>
    );
  }

  return children(params);
};

const IsParamsIdWrapper = ({
  albumId,
  children,
}: {
  albumId: string | undefined;
  children: (albumId: string) => ReactElement;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (albumId || !router) {
      return;
    }

    setTimeout(() => {
      toast(<MyToast text="Something went wrong" type="error" />);
      void router.push("/albums");
    }, 800);
  }, [albumId, router]);

  if (!albumId) {
    return (
      <div className="my-screen-center">
        <p>Something went wrong.</p>;
      </div>
    );
  }

  return children(albumId);
};

const FetchAlbumWrapper = ({
  albumId,
  children: pageContent,
}: {
  albumId: string;
  children: (album: Album) => ReactElement;
}) => {
  const router = useRouter();

  const { data: album, isFetched } = api.album.albumPageGetOne.useQuery({
    albumId,
  });

  useEffect(() => {
    if (!isFetched || album || !router) {
      return;
    }

    setTimeout(() => {
      toast(<MyToast text="Redirected because album not found" type="info" />);
      void router.push("/albums");
    }, 800);
  }, [album, isFetched, router]);

  if (!isFetched) {
    return (
      <div className="my-screen-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="my-screen-center">
        <p>Album not found. Redirecting...</p>
      </div>
    );
  }

  return pageContent(album);
};
