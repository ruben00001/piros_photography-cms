import { AlbumImageProvider, useAlbumContext } from "~/album-page/_context";
import AlbumImage from "./image";

const Populated = () => {
  const album = useAlbumContext();

  return (
    <>
      <div>{JSON.stringify(album.images.map((i) => i.index))}</div>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        {album.images.map((albumImage) => (
          <AlbumImageProvider albumImage={albumImage} key={albumImage.id}>
            <AlbumImage />
          </AlbumImageProvider>
        ))}
      </div>
    </>
  );
};

export default Populated;
