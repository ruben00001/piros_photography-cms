import { useAlbumContext } from "~/components/my-pages/album/_context";
import Unpopulated from "./Unpopulated";
import Populated from "./populated";

const Images = () => {
  const album = useAlbumContext();

  return <div>{!album.images.length ? <Unpopulated /> : <Populated />}</div>;
};

export default Images;
