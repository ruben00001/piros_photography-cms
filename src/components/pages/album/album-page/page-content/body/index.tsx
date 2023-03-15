import DndSortableContext from "~/components/dnd-kit/DndSortableContext";
import { AlbumTitleInput } from "~/components/pages/album/_containers";
import { useAlbumContext } from "../../_context/AlbumState";

const AlbumBody = () => {
  return (
    <div className="p-xl">
      <div>
        <Title />
      </div>
      <div className="mt-xl">
        <Images />
      </div>
    </div>
  );
};

export default AlbumBody;

const Title = () => {
  const { id, title } = useAlbumContext();

  return (
    <div className="text-2xl">
      <AlbumTitleInput album={{ id, title }} />
    </div>
  );
};

const Images = () => {
  const { images } = useAlbumContext();
  console.log("images:", images);

  return <div>Hello</div>;
};

const Image = () => {
  return <div></div>;
};
