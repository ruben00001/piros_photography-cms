import { Prisma, type AlbumImage } from "@prisma/client";
import produce from "immer";

const albumWithImages = Prisma.validator<Prisma.AlbumArgs>()({
  include: { images: true },
});
type AlbumWithImages = Prisma.AlbumGetPayload<typeof albumWithImages>;

export function updateAlbumImageProperty<
  TAlbum extends AlbumWithImages,
  TKey extends keyof AlbumImage,
>(input: {
  data: { album: TAlbum; value: AlbumImage[TKey] };
  where: { albumImageId: string; key: TKey };
}) {
  const updated = produce(input.data.album, (draft) => {
    const albumImageIndex = draft.images.findIndex(
      (albumImage) => albumImage.id === input.where.albumImageId,
    );
    const image = draft.images[albumImageIndex];
    if (!image) {
      return;
    }
    image[input.where.key] = input.data.value;
  });

  return updated;
}

/* export function updateImageTitle<TAlbum extends AlbumWithImages>({
  input,
}: {
  input: {
    data: { album: TAlbum; title: string };
    where: { albumImageId: string };
  };
}) {
  const updated = produce(input.data.album, (draft) => {
    const albumImageIndex = draft.images.findIndex(
      (albumImage) => albumImage.id === input.where.albumImageId,
    );
    const image = draft.images[albumImageIndex];
    if (!image) {
      return;
    }
    image.title = input.data.title;
  });

  return updated;
}
 */
