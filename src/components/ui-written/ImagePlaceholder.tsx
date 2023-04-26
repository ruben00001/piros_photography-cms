import { ImageIcon } from "~/components/ui-elements";

export const ImagePlaceholder = () => (
  <div className="grid aspect-video place-items-center rounded-md bg-gray-300 transition-colors duration-150 ease-in-out hover:bg-gray-200">
    <div className="text-5xl text-gray-100">
      <ImageIcon />
    </div>
  </div>
);
