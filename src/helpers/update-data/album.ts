import { Prisma } from "@prisma/client";
import produce from "immer";

import { type MyPick } from "~/types/utilities";

const albumWithImages = Prisma.validator<Prisma.AlbumArgs>()({
  include: { images: true },
});
type AlbumWithImages = Prisma.AlbumGetPayload<typeof albumWithImages>;
type AlbumImage = AlbumWithImages["images"][0];

type UpdatableKey = keyof MyPick<
  AlbumImage,
  "imageId" | "index" | "title" | "description"
>;

export function updateAlbumImageProperty<
  TAlbum extends AlbumWithImages,
  TKey extends UpdatableKey,
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
