import { useState } from "react";

const PanelBody = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return <div></div>;
};

export default PanelBody;

const ImageFile = ({ file }: { file: File }) => {
  const imgSrc = URL.createObjectURL(file);

  return (
    <div css={[tw`flex gap-md`]}>
      <div css={[tw`border-2`]}>
        <NextImage
          width={150}
          height={150}
          layout="fixed"
          objectFit="contain"
          src={imgSrc}
          alt=""
          css={[tw`bg-gray-50`]}
        />
      </div>
      <div css={[tw`flex flex-col justify-center`]}>
        <h4 css={[tw`font-medium text-sm`]}>Image file:</h4>
        <p css={[tw`text-sm text-gray-600`]}>{file.name}</p>
      </div>
    </div>
  );
};
