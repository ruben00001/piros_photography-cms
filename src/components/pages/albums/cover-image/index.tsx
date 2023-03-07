import { CldImage } from "next-cloudinary";

import AddImageMenu from "~/components/image/add-image/menu";
import { useAlbumStateContext } from "~/context/AlbumState";

const CoverImage = () => {
  const album = useAlbumStateContext();
  console.log("album:", album);

  return <div>{!album.coverImageId ? <Unpopulated /> : <Populated />}</div>;
};

export default CoverImage;

const Unpopulated = () => {
  return (
    <div className="rounded-sm border p-4">
      <p>No cover image yet.</p>
      <AddImageMenu>
        <span>Add Image</span>
      </AddImageMenu>
    </div>
  );
};

// how to include image in original fetch

const Populated = () => {
  const album = useAlbumStateContext();
  console.log("album:", album);
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

/* const ImageNotFound = () => {
  return <div>Image not found</div>;
};

const ImageFound = () => {
  return <div></div>;
};
 */
