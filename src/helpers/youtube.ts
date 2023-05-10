import { z } from "zod";

export const checkIsYoutubeUrl = (value: string) => {
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  const isValid = regex.test(value);

  return isValid;
};

export const getYoutubeVideoIdFromUrl = z
  .function()
  .args(
    z.object({
      youtubeUrl: z
        .string()
        .regex(
          /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        ),
    })
  )
  .implement(({ youtubeUrl }) => {
    const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regex);

    if (!match) {
      return null;
    }

    const id = match[1];

    return id;
  });

export const getYoutubeEmbedUrlFromId = (id: string) => {
  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return embedUrl;
};
