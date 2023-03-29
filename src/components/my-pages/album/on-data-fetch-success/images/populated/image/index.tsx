import { useMeasure } from "react-use";

import MyCldImage from "~/components/image/MyCldImage";
import {
  AlbumImageProvider,
  useAlbumImageContext,
} from "~/components/my-pages/album/_context";
import { type AlbumImage } from "~/components/my-pages/album/_types";
import Menu from "./Menu";

const AlbumImage = () => {
  const albumImage = useAlbumImageContext();

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  return (
    <AlbumImageProvider albumImage={albumImage}>
      <div className="group/albumImage relative" ref={containerRef}>
        {width ? (
          <MyCldImage
            publicId={albumImage.image.cloudinary_public_id}
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
