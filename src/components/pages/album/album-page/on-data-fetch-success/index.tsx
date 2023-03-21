import { AlbumProvider } from "~/album-page/_context";
import { type Album } from "~/album-page/_types";

import CollapsableSection from "~/components/collapsable-section";
import AddImageButton from "./AddImage";
import MetaAndControls from "./MetaAndControls";
import About from "./About";
import Images from "./images";

const OnDataFetchSuccess = ({ album }: { album: Album }) => {
  return (
    <AlbumProvider album={album}>
      <div className="p-xl">
        <CollapsableSection
          showSectionText="Show album info"
          margin={{ bottom: { close: 10, open: 20 } }}
        >
          <MetaAndControls />
        </CollapsableSection>
        <CollapsableSection
          showSectionText="Show add album image button"
          margin={{ bottom: { close: 0 } }}
        >
          <AddImageButton />
        </CollapsableSection>
        <div className="mt-lg">
          <About />
          <Images />
        </div>
      </div>
    </AlbumProvider>
  );
};

export default OnDataFetchSuccess;
