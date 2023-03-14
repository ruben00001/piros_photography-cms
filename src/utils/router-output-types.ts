import { type RouterOutputs } from "~/utils/api";

export type AlbumRouterOutputs = {
  getOne: RouterOutputs["album"]["getOne"];
  /*   getOne: {
    includeCoverImage: RouterOutputs['album']['getOne']
  } */
  /*   includeCoverImage: AlbumBase & {
    coverImage: Image | null;
  };
  includeCoverImageAndImages: AlbumBase & {
    images: AlbumImage[];
    coverImage: Image | null;
  }; */
};

// export type Album = RouterOutputs["album"]["getAll"][0];

export type Image = RouterOutputs["image"]["getAll"][0];
