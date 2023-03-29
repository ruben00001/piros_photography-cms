import axios from "axios";
import { api } from "../utils/api";

const Test = () => {
  // const createImageMutation = api.image.create.useMutation();

  /*   const getAllUsedCloudinaryPublicIds = async () => {
    const albums = await fetchAlbums();
    const imagePublicIds = albums.flatMap((album) => {
      return [
        album.mainimage.public_id,
        ...album.image.map((image) => image.public_id),
      ];
    });
    const uniquePublicIds = [...new Set(imagePublicIds)];
    console.log("uniquePublicIds:", uniquePublicIds);
    return uniquePublicIds;
  };

  const getInfo = async (cloudinary_public_id) => {
    const getString = `https://res.cloudinary.com/dmez60vl2/image/upload/c_limit,w_800/f_auto/q_auto/fl_getinfo/${cloudinary_public_id}`;

    const res = await axios.get(getString);

    return {
      cloudinary_public_id,
      naturalHeight: res.data.input.height,
      naturalWidth: res.data.input.width,
    };
  };

  const handleCreateImage = async (public_id) => {
    const naturalDimensions = await getInfo(public_id);

    createImageMutation.mutate({
      cloudinary_public_id: public_id,
      ...naturalDimensions,
    });
  };

  const handleCreateImages = async () => {
    const public_ids = await getAllUsedCloudinaryPublicIds();
    const cloudImagesData = await axios.all(
      public_ids.map(async (public_id) => await getInfo(public_id))
    );
    cloudImagesData.forEach((cloudImgData) => {
      createImageMutation.mutate(cloudImgData);
    });
  }; */

  const fetchAlbums = async () => {
    const getString = "https://amma-strapi.herokuapp.com/essays";

    const res = await axios.get(getString);
    console.log("res:", res.data);

    return res.data;
  };

  const createAlbumMutation = api.album.createPopulate.useMutation();

  const handleCreateAlbums = async () => {
    const albums = await fetchAlbums();
    const undoneAlbums = albums.slice(1, albums.length);

    undoneAlbums.forEach((album, i) => {
      createAlbumMutation.mutate({
        cloudinary_public_ids: album.image.map((i) => i.public_id),
        title: album.title,
        index: i,
        coverImageCloudPubId: album.mainimage.public_id,
      });
    });
  };

  // create album and connect images

  return (
    <div className="flex flex-col gap-4">
      {/*       <button
        onClick={() => {
          fetchAlbums();
        }}
      >
        Fetch albums
      </button>
      <button
        onClick={() => {
          handleCreateAlbums();
        }}
      >
        Create albums
      </button> */}
      {/*       <button onClick={getAllUsedCloudinaryPublicIds}>Get Unique ids</button>
      <button onClick={() => getInfo("huuzcnrpmbnqg69jeauq")}>Get Info</button>
      <button onClick={() => handleCreateImage("huuzcnrpmbnqg69jeauq")}>
        Create Image
      </button>
      <button onClick={() => handleCreateImages()}>Create Images</button> */}
    </div>
  );
};

export default Test;
