import AddImageMenu from "~/components/image/add-image/menu";

type Props = { coverImageId?: string };

const CoverImage = ({ coverImageId }: Props) => {
  return <div>{!coverImageId ? <Unpopulated /> : <Populated />}</div>;
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

const Populated = () => {
  return <div></div>;
};

/* const ImageNotFound = () => {
  return <div>Image not found</div>;
};

const ImageFound = () => {
  return <div></div>;
};
 */
