import CollapsableSection from "~/components/collapsable-section";
import AddAlbumImageButton from "./AddAlbumImage";
import AlbumBody from "./body";
import MetaPanel from "./MetaPanel";

const PageContent = () => {
  return (
    <div className="p-xl">
      <CollapsableSection
        showSectionText="Show album info"
        margin={{ bottom: { close: 10, open: 20 } }}
      >
        <MetaPanel />
      </CollapsableSection>
      <CollapsableSection
        showSectionText="Show add album image button"
        margin={{ bottom: { close: 0 } }}
      >
        <AddAlbumImageButton />
      </CollapsableSection>
      <div className="mt-lg">{/* <AlbumBody /> */}</div>
    </div>
  );
};

export default PageContent;
