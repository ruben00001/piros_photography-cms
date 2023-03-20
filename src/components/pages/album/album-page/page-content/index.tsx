import CollapsableSection from "~/components/collapsable-section";
import { CaretDownIcon, CaretRightIcon } from "~/components/Icon";
import AddAlbumImageButton from "./AddAlbumImage";
import AlbumBody from "./body";
import MetaPanel from "./MetaPanel";

const PageContent = () => {
  return (
    <div className="p-xl">
      <MetaPanel />
      <CollapsableSection>
        <AddAlbumImageButton />
      </CollapsableSection>
      {/* <div className="relative border-2">
        <CollapsableSection
          button={({ closeSection, isOpen, openSection }) => (
            <div
              className="absolute -left-xs top-0 -translate-x-full cursor-pointer text-gray-400"
              onClick={isOpen ? closeSection : openSection}
            >
              {isOpen ? (
                <CaretDownIcon />
              ) : (
                <div className="relative duration-100 ease-in-out hover:brightness-90">
                  <span className="text-gray-300">
                    <CaretRightIcon />
                  </span>
                  <span className="absolute top-1/2 -right-xs translate-x-full -translate-y-1/2 whitespace-nowrap text-sm text-gray-300">
                    Show album info
                  </span>
                </div>
              )}
            </div>
          )}
        >
          <div className="mt-xl">
            <AddAlbumImageButton />
          </div>
        </CollapsableSection>
      </div> */}
      <div className="mt-lg">{/* <AlbumBody /> */}</div>
    </div>
  );
};

export default PageContent;
