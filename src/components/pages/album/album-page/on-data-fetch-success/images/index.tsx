import { AlbumImageProvider, useAlbumContext } from "~/album-page/_context";
import AlbumImage from "./image";

const Images = () => {
  const album = useAlbumContext();

  return (
    <div>
      {!album.images.length ? (
        <p>No images yet</p>
      ) : (
        <div className="mt-lg grid grid-cols-2 gap-xl">
          {album.images.map((albumImage) => (
            <AlbumImageProvider albumImage={albumImage} key={albumImage.id}>
              <AlbumImage />
            </AlbumImageProvider>
          ))}
        </div>
      )}
    </div>
  );
};

export default Images;
