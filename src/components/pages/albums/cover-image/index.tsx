import { CldImage } from "next-cloudinary";

import AddImageMenu from "~/components/image/add-image/menu";
import { useAlbumContext } from "~/context/AlbumState";
import { ImageIcon } from "~/components/Icon";
import WithTooltip from "~/components/data-display/WithTooltip";

const CoverImage = () => {
  const album = useAlbumContext();

  return <div>{!album.coverImageId ? <Unpopulated /> : <Populated />}</div>;
};

export default CoverImage;

const Unpopulated = () => {
  return (
    <AddImageMenu buttonClasses="w-full">
      <ImagePlaceholder />
    </AddImageMenu>
  );
};

const ImagePlaceholder = () => {
  return (
    <WithTooltip text="Add image" type="action">
      <div className="grid aspect-video place-items-center rounded-md bg-gray-300 transition-colors duration-150 ease-in-out hover:bg-gray-200">
        <div className="text-5xl text-gray-100">
          <ImageIcon />
        </div>
      </div>
    </WithTooltip>
  );
};

// how to include image in original fetch

const Populated = () => {
  const album = useAlbumContext();

  if (!album.coverImage) {
    // would really be an error if there was a coverimageId but no cover image
    return null;
  }

  return (
    <div>
      <CldImage
        width={500}
        height={500}
        src={album.coverImage.cloudinary_public_id}
        alt=""
      />
    </div>
  );
};
