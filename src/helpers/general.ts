import { z } from "zod";

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

export const calcImageDimensions = z
  .function()
  .args(
    z.object({
      image: z.object({ width: z.number(), height: z.number() }),
      constraint: z.object({
        value: z.object({ width: z.number(), height: z.number() }),
        maxDecimal: z.object({
          width: z.number().gt(0).lte(1),
          height: z.number().gt(0).lte(1),
        }),
      }),
    })
  )
  .implement(({ constraint, image }) => {
    const imageAspectRatio = image.width / image.height;

    const maxWidth = constraint.value.width * constraint.maxDecimal.width;
    const maxHeight = constraint.value.height * constraint.maxDecimal.height;

    let width = maxWidth;
    let height = width / imageAspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * imageAspectRatio;
    }

    return { width, height };
  });
