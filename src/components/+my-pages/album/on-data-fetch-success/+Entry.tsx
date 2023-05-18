import { AlbumProvider } from "~/components/+my-pages/album/_context";
import { type Album } from "~/components/+my-pages/album/_types";
import Layout from "~/components/layouts";
import { CollapsableSection } from "~/components/ui-compounds";
import About from "./About";
import AddImageButton from "./AddImage";
import MetaAndControls from "./MetaAndControls";
import Images from "./images";

const OnDataFetchSuccess = ({ album }: { album: Album }) => (
  <Layout.ContentBody maxWidth={1800}>
    <AlbumProvider album={album}>
      <div className="p-xl">
        <CollapsableSection
          showSectionText="Show album info"
          margin={{ bottom: { close: 10, open: 20 } }}
        >
          <MetaAndControls />
        </CollapsableSection>
        <div className="mt-lg">
          <CollapsableSection
            showSectionText="Show add album image button"
            margin={{ bottom: { close: 0 } }}
          >
            <AddImageButton />
          </CollapsableSection>
        </div>
        <div className="mt-lg">
          <About />
          <Images />
        </div>
      </div>
    </AlbumProvider>
  </Layout.ContentBody>
);

export default OnDataFetchSuccess;
