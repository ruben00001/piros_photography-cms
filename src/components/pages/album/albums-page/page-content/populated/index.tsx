import { api } from "~/utils/api";
import { AlbumProvider } from "../../_context/AlbumState";
import AddAlbum from "./AddAlbum";
import Album from "../Album";

const Populated = () => {
  const { data } = api.album.albumsPageGetAll.useQuery(undefined, {
    enabled: false,
  });
  const albums = data as NonNullable<typeof data>;

  return (
    <div className="p-lg">
      <div className="max-w-[400px]">
        <AddAlbum />
      </div>
      <div className="mt-lg grid grid-cols-2 gap-xl">
        {albums.map((album) => (
          <AlbumProvider album={album} key={album.id}>
            <Album />
          </AlbumProvider>
        ))}
      </div>
    </div>
  );
};

export default Populated;
