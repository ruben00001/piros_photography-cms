import { useState } from "react";

export const useHovered = () => {
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
