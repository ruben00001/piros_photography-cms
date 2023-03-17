export function checkObjectHasField<T extends Record<string, unknown>>(obj: T) {
  const hasAKey = Object.keys(obj).length;

  return Boolean(hasAKey);
}

export const calcImageDimensionsToFitToScreen = ({
  height: initialHeight,
  width: initialWidth,
}: {
  width: number;
  height: number;
}): { width: number; height: number } => {
  const imageAspectRatio = initialWidth / initialHeight;

  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  let width = maxWidth;
  let height = width / imageAspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * imageAspectRatio;
  }

  return { width, height };
};
