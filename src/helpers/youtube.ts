import { z } from "zod";

export const checkIsYoutubeUrl = (value: string) => {
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
  const isValid = regex.test(value);

  return isValid;
};

export const getYoutubeVideoIdFromUrlZ = z
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
    console.log("match:", match);

    const zMatch = z
      .string({ invalid_type_error: "is not youtube url" })
      .regex(regex);

    console.log("zMatch:", zMatch);

    zMatch.parse(youtubeUrl);

    if (!match) {
      return "no match";
    }

    const id = match[1];

    return id;
  });

export const getYoutubeVideoIdFromUrl = (url: string) => {
  const regex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regex);

  if (!match) {
    return null;
  }

  const id = match[1];

  return id;
};

export const getYoutubeEmbedUrlFromId = (id: string) => {
  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return embedUrl;
};
