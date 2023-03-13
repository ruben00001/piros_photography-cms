import AddImageMenu from "~/components/image/add-image/menu";
import { useAlbumContext } from "~/context/AlbumState";
import { ImageIcon } from "~/components/Icon";
import WithTooltip from "~/components/data-display/WithTooltip";
import MyCldImage from "~/components/image/MyCldImage";
import { useAlbumsContext } from "~/context/AlbumsState";
import { type ReactElement } from "react";

const CoverImage = () => {
  const album = useAlbumContext();

  return (
    <div className="">
      {!album.coverImageId ? <Unpopulated /> : <Populated />}
    </div>
  );
};

export default CoverImage;

const CoverImageMenu = ({
  children,
  tooltipText,
}: {
  children: ReactElement;
  tooltipText: string;
}) => {
  const album = useAlbumContext();
  const { setActiveAlbum } = useAlbumsContext();

  return (
    <AddImageMenu
      buttonClasses="w-full"
      onImageModalVisibilityChange={{
        open: () => setActiveAlbum(album),
      }}
    >
      {({ isOpen }) => (
        <WithTooltip text={tooltipText} type="action" isDisabled={isOpen}>
          <div>{children}</div>
        </WithTooltip>
      )}
    </AddImageMenu>
  );
};

const Unpopulated = () => {
  return (
    <CoverImageMenu tooltipText="Click to add image">
      <ImagePlaceholder />
    </CoverImageMenu>
  );
};

const ImagePlaceholder = () => {
  return (
    <div className="grid aspect-video place-items-center rounded-md bg-gray-300 transition-colors duration-150 ease-in-out hover:bg-gray-200">
      <div className="text-5xl text-gray-100">
        <ImageIcon />
      </div>
    </div>
  );
};

const Populated = () => {
  const album = useAlbumContext();

  if (!album.coverImage) {
    // would really be an error if there was a coverimageId but no cover image
    return null;
  }

  return (
    <CoverImageMenu tooltipText="Click to change image">
      <div className="">
        <MyCldImage
          fit="object-cover"
          heightSetByContainer={{ isSetByContainer: false, approxVal: 800 }}
          src={album.coverImage.cloudinary_public_id}
          imgAdditionalClasses="transition-transform duration-200 ease-in-out group-hover:scale-95"
          wrapperAdditionalClasses="overflow-hidden transition-colors duration-150 ease-in-out hover:rounded-md hover:bg-gray-100 "
        />
      </div>
    </CoverImageMenu>
  );
};
