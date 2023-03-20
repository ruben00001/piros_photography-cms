import { type AlbumImage } from "./_types";

import MyCldImage from "~/components/image/MyCldImage";
import { AlbumImageProvider } from "./_context/AlbumImageState";
import Menu from "./Menu";

const AlbumImage = ({ albumImage }: { albumImage: AlbumImage }) => {
  return (
    <AlbumImageProvider albumImage={albumImage}>
      <div className="group/albumImage relative">
        <MyCldImage
          fit="object-cover"
          heightSetByContainer={{
            isSetByContainer: false,
            approxVal: 800,
          }}
          src={albumImage.image.cloudinary_public_id}
        />
        <Menu />
      </div>
    </AlbumImageProvider>
  );
};

export default AlbumImage;
