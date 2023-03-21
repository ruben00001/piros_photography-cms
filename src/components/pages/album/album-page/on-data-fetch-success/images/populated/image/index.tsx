import { useMeasure } from "react-use";

import { type AlbumImage } from "~/album-page/_types";
import {
  AlbumImageProvider,
  useAlbumImageContext,
} from "~/album-page/_context";

import MyCldImage from "~/components/image/MyCldImage";
import Menu from "./Menu";

const AlbumImage = () => {
  const albumImage = useAlbumImageContext();

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  return (
    <AlbumImageProvider albumImage={albumImage}>
      <div className="group/albumImage relative" ref={containerRef}>
        {width ? (
          <MyCldImage
            src={albumImage.image.cloudinary_public_id}
            dimensions={{
              width,
              height:
                width /
                (albumImage.image.naturalWidth /
                  albumImage.image.naturalHeight),
            }}
          />
        ) : null}
        <Menu />
      </div>
    </AlbumImageProvider>
  );
};

export default AlbumImage;
