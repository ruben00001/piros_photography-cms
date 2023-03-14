import { useRouter } from "next/router";
import { type ReactElement, useEffect } from "react";
import { toast } from "react-toastify";

import { type Album } from "~/components/pages/albums/album-page/_context/AlbumState";
import useDynamicRouteParams from "~/hooks/useDynamicRouteParams";
import { api } from "~/utils/api";

import Toast from "~/components/data-display/Toast";

export default function PageInit({
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
    if (albumId) {
      return;
    }

    setTimeout(() => {
      toast(<Toast text="Something went wrong" type="error" />);
      router.push("/albums");
    }, 800);
  }, [albumId]);

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
  const { data: album, isFetched } = api.album.getOne.useQuery({
    albumId,
    includeImages: true,
  });

  useEffect(() => {
    if (!isFetched) {
      return;
    }
    if (album) {
      return;
    }

    setTimeout(() => {
      toast(<Toast text="Redircted because album not found" type="info" />);
      router.push("/albums");
    }, 800);
  }, [isFetched]);

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
