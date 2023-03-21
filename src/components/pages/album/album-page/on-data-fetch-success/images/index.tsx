import { useAlbumContext } from "~/album-page/_context";
import Populated from "./populated";
import Unpopulated from "./Unpopulated";

const Images = () => {
  const album = useAlbumContext();

  return <div>{!album.images.length ? <Unpopulated /> : <Populated />}</div>;
};

export default Images;
