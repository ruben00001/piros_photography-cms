import { z } from "zod";
import imageCompression from "browser-image-compression";
import { env } from "~/env.mjs";

// import { env } from "~/env.mjs";

export const uploadImageToCloudinary = async (formData: FormData) => {
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (res.status !== 200) {
    throw new Error("upload failed");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const resData = (await res.json()) as Record<string, unknown> & {
    public_id: string;
  };

  return { cloudinary_public_id: resData.public_id };
};

export const createCloudinaryImageFormData = z
  .function()
  .args(
    z.object({
      file: z.custom<File>(),
      signature: z.string(),
      timestamp: z.number(),
      upload_preset: z.literal("signed"),
    })
  )
  .implement(async ({ file, signature, timestamp, upload_preset }) => {
    const formData = new FormData();

    const optimisedImageFile = await imageCompression(file, {
      maxWidthOrHeight: 1200,
      initialQuality: 0.9,
    });

    formData.append("file", optimisedImageFile);

    formData.append("upload_preset", upload_preset);

    formData.append("signature", signature);
    formData.append("api_key", env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", String(timestamp));

    return formData;
  });

export const handleUploadImage = async ({
  file,
  signatureData,
}: {
  file: File;
  signatureData: { signature: string; timestamp: number };
}) => {
  const formData = await createCloudinaryImageFormData({
    file,
    ...signatureData,
    upload_preset: "signed",
  });

  const uploadRes = await uploadImageToCloudinary(formData);

  const { cloudinary_public_id } = uploadRes;

  return { cloudinary_public_id };
};
