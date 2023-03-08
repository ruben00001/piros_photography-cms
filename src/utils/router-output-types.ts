import { type RouterOutputs } from "~/utils/api";

export type Album = RouterOutputs["album"]["getAll"][0];

export type Image = RouterOutputs["image"]["getAll"][0];
