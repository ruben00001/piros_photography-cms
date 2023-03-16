import { toast } from "react-toastify";

import { api } from "~/utils/api";
import { useAlbumContext } from "../../_context/AlbumState";

import Toast from "~/components/data-display/Toast";
import { TextInputForm } from "~/components/TextInputForm";
import AlbumImage from "./album-image";

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
  const album = useAlbumContext();

  const updateTitle = api.album.updateTitle.useMutation();

  return (
    <div className="text-4xl">
      <TextInputForm
        onSubmit={({ inputValue, onSuccess }) =>
          updateTitle.mutate(
            { albumId: album.id, updatedTitle: inputValue },
            {
              onSuccess: async () => {
                toast(<Toast text="Title updated" type="success" />);

                onSuccess();
              },
            }
          )
        }
        tooltipText="click to edit title"
        initialValue={album.title}
        placeholder="Album title"
      />
    </div>
  );
};

// TODO: handle inedx on delete image

const Images = () => {
  const album = useAlbumContext();

  return (
    <div>
      {!album.images.length ? (
        <p>No images yet</p>
      ) : (
        <div className="mt-lg grid grid-cols-2 gap-xl">
          {album.images.map((albumImage) => (
            <AlbumImage albumImage={albumImage} key={albumImage.id} />
          ))}
        </div>
      )}
    </div>
  );
};

/* const Image = ({ albumImage }: { albumImage: AlbumImage }) => {
  const { setImageContext } = useImageTypeContext();

  return (
    <div>
      <AddImageMenu
        styles={{ buttonWrapper: "w-full" }}
        imageModals={{
          onVisibilityChange: {
            onOpen() {
              setImageContext({
                replace: { where: { id: albumImage.id } },
              });
            },
          },
        }}
      >
        {({ isOpen }) => (
          <div>
            <WithTooltip
              text="click to change image"
              type="action"
              isDisabled={isOpen}
            >
              <div>
                <MyCldImage
                  fit="object-cover"
                  heightSetByContainer={{
                    isSetByContainer: false,
                    approxVal: 800,
                  }}
                  src={albumImage.image.cloudinary_public_id}
                  styles={{
                    img: "transition-transform duration-200 ease-in-out group-hover:scale-95",
                    wrapper:
                      "overflow-hidden transition-colors duration-150 ease-in-out hover:rounded-md hover:bg-gray-100 ",
                  }}
                />
              </div>
            </WithTooltip>
          </div>
        )}
      </AddImageMenu>
    </div>
  );
};
 */
