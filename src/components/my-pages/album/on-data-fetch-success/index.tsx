import CollapsableSection from "~/components/collapsable-section";
import { ContentBodyLayout } from "~/components/layout";
import { AlbumProvider } from "~/components/my-pages/album/_context";
import { type Album } from "~/components/my-pages/album/_types";
import About from "./About";
import AddImageButton from "./AddImage";
import MetaAndControls from "./MetaAndControls";
import Images from "./images";

const OnDataFetchSuccess = ({ album }: { album: Album }) => {
  return (
    <ContentBodyLayout maxWidth={1800}>
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
    </ContentBodyLayout>
  );
};

export default OnDataFetchSuccess;
