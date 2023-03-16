import ContainerWidth from "~/components/ContainerWidth";
import MyCldImage from "~/components/image/MyCldImage2";
import { useAlbumImageContext } from "../../../_context/AlbumImageState";

const ImageModalPanel = () => {
  return (
    <div className="flex">
      <div>Description</div>
      <ImagePanel />
    </div>
    /*     <div className="flex h-[94vh] rounded-md">
      <DescriptionPanel />
    </div> */
  );
};

export default ImageModalPanel;

const DescriptionPanel = () => {
  return <div className="bg-white bg-opacity-80 pr-md">Description</div>;
};

const ImagePanel = () => {
  const { image } = useAlbumImageContext();
  console.log("image:", image);

  return (
    // <div className="flex-grow border-2 bg-white/90">
    <MyCldImage
      src={image.cloudinary_public_id}
      dimensions={calcImageDimensions({
        imageHeight: image.height!,
        imageWidth: image.width!,
      })}
    />
  );
};

const calcImageDimensions = ({
  imageHeight,
  imageWidth,
}: {
  imageWidth: number;
  imageHeight: number;
}): { width: number; height: number } => {
  const imageAspectRatio = imageWidth / imageHeight;

  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  let width = maxWidth;
  let height = width / imageAspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * imageAspectRatio;
  }

  return { width, height };
};
