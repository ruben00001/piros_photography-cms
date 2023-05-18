import { useAlbumContext } from "~/components/+my-pages/album/_context";
import Populated from "./populated/+Entry";
import Unpopulated from "./unpopulated/+Entry";

const Images = () => {
  const album = useAlbumContext();

  return <div>{!album.images.length ? <Unpopulated /> : <Populated />}</div>;
};

export default Images;
