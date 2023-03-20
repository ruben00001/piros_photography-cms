import { type RouterOutputs } from "~/utils/api";

export type Album = NonNullable<RouterOutputs["album"]["albumPageGetOne"]>;
