import { useState } from "react";

const useHovered = () => {
  const [isHovered, setIsHovered] = useState(false);

  return [
    isHovered,
    {
      setIsHovered,
      hoverHandlers: {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      },
    },
  ] as const;
};

export default useHovered;
