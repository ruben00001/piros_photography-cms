import AddImageMenu from "~/components/image/add-image/menu";
import { useAlbumContext } from "~/context/AlbumState";
import { ImageIcon } from "~/components/Icon";
import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import { useAlbumsContext } from "~/context/AlbumsState";

const CoverImage = () => {
  const album = useAlbumContext();

  return (
    <div className="">
      {!album.coverImageId ? <Unpopulated /> : <Populated />}
    </div>
  );
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
  const { setActiveAlbumId } = useAlbumsContext();

  if (!album.coverImage) {
    // would really be an error if there was a coverimageId but no cover image
    return null;
  }

  return (
    <AddImageMenu
      buttonClasses="w-full"
      onChangeVisibility={{
        close: () => setActiveAlbumId(null),
        open: () => setActiveAlbumId(album.id),
      }}
    >
      <WithTooltip text="Click to change image">
        <div className="z-30">
          <MyCldImage
            fit="object-cover"
            heightSetByContainer={{ isSetByContainer: false, approxVal: 800 }}
            src={album.coverImage.cloudinary_public_id}
            imgAdditionalClasses="transition-transform duration-200 ease-in-out group-hover:scale-95"
            wrapperAdditionalClasses="overflow-hidden transition-colors duration-150 ease-in-out hover:rounded-md hover:bg-gray-100 "
          />
        </div>
      </WithTooltip>
    </AddImageMenu>
  );
};
