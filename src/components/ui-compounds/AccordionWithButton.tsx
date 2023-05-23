import { useState, type ReactElement } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useMeasure } from "react-use";

import { PlusIcon } from "~/components/ui-elements";

export const AccordionWithButton = ({
  children,
  buttonText,
}: {
  children: (arg0: { closeForm: () => void }) => ReactElement;
  buttonText: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [sectionRef, { height: sectionHeight }] = useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: { height: "0px", opacity: 0 },
  }));

  const openSection = () => {
    api.start({
      from: { height: "0px", opacity: 0 },
      to: { height: `${sectionHeight + 10}px`, opacity: 100 },
    });
    setIsOpen(true);
  };
  const closeSection = () => {
    api.start({
      from: { height: `${sectionHeight + 10}px`, opacity: 100 },
      to: { height: "0px", opacity: 0 },
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`my-btn-action group mb-sm flex items-center gap-xs rounded-md py-1.5 px-sm text-white ${
          isOpen ? "pointer-events-none cursor-auto opacity-75" : ""
        }`}
        onClick={() => !isOpen && openSection()}
        type="button"
      >
        <span className="text-sm">
          <PlusIcon weight="bold" />
        </span>
        <span className="text-sm font-medium">{buttonText}</span>
      </button>
      <animated.div style={{ overflowY: "hidden", ...springs }}>
        <div ref={sectionRef}>{children({ closeForm: closeSection })}</div>
      </animated.div>
    </>
  );
};
