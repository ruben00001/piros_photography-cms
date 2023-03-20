import { animated, useSpring } from "@react-spring/web";
import { useState, type ReactElement } from "react";
import { useMeasure } from "react-use";
import WithTooltip from "../data-display/WithTooltip";
import { CaretDownIcon, CaretRightIcon } from "../Icon";

const CollapsableSection = ({
  children: sectionContent,
  showSectionText = "Show section",
}: {
  children: ReactElement;
  showSectionText?: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [springAtRest, setSpringAtRest] = useState(true);

  const [sectionContentRef, { height: sectionContentHeight }] =
    useMeasure<HTMLDivElement>();
  const [openSectionTextRef, { height: openSectionTextHeight }] =
    useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    // config: { tension: 200, friction: 40 },
    onChange: () => setSpringAtRest(false),
    onRest: () => setSpringAtRest(true),
  }));

  const openSection = () => {
    api.start({
      from: { height: "0px" },
      to: { height: `${sectionContentHeight}px` },
    });
    setIsOpen(true);
  };

  const closeSection = () => {
    api.start({
      from: { height: `${sectionContentHeight}px` },
      to: { height: "0px" },
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" style={{ minHeight: openSectionTextHeight }}>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <div ref={sectionContentRef}>{sectionContent}</div>
      </animated.div>
      <WithTooltip
        text="hide section"
        type="action"
        isDisabled={!isOpen}
        placement="top-start"
      >
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
            </div>
          )}
        </div>
      </WithTooltip>
      <div
        className={`absolute top-0 left-0 -translate-y-[1px] whitespace-nowrap bg-white text-xs text-gray-300 ${
          springAtRest && !isOpen ? "z-30 opacity-100" : "-z-10 opacity-0"
        }`}
        ref={openSectionTextRef}
      >
        {showSectionText}
      </div>
    </div>
  );
};

export default CollapsableSection;
