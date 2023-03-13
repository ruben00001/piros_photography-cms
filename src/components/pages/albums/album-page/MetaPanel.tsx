// cover image
// published
// created, updated at

import { ReactElement } from "react";
import WithTooltip from "~/components/data-display/WithTooltip";
import AddImageMenu from "~/components/image/add-image/menu";
import MyCldImage from "~/components/image/MyCldImage";
import ImagePlaceholder from "~/components/image/Placeholder";
import { useAlbumContext } from "~/context/AlbumState";
import CoverImage from "../_containers/cover-image";

const MetaPanel = () => {
  return (
    <div className="">
      <div className="flex items-center gap-sm">
        <p className="font-mono text-sm">Title:</p>
        <h3 className="font-mono text-sm">Title</h3>
      </div>
      <div>
        <p className="font-mono text-sm">Cover Image:</p>
        <div className="h-auto w-[200px]">
          <CoverImage />
        </div>
      </div>
    </div>
  );
};

export default MetaPanel;
