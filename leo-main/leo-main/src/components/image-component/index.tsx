import Image from 'next/image';

const ImageComponent = ({
  url,
  width,
  height,
  alt,
  styling,
}: {
  url?: string;
  width: number;
  height: number;
  alt: string;
  styling?: string;
}) => {
  return (
    <Image
      src={url || ''}
      alt={alt}
      width={width}
      height={height}
      className={styling}
    />
  );
};

export default ImageComponent;
