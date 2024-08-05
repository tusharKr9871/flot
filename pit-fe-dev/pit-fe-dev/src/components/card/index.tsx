import Image, { StaticImageData } from "next/image";
import Link from "next/link";

const Card = ({
  id,
  title,
  author,
  imageUrl,
}: {
  id: number;
  title: string;
  author: string;
  imageUrl: StaticImageData;
}) => (
  <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md xl:w-[24rem] lg:w-[19rem] md:w-[16rem] w-auto h-full md:mb-0 mb-6">
    <div className="flex-1 relative overflow-hidden rounded-t-lg">
      <div className="w-full">
        <Image
          alt="blog-image"
          src={imageUrl}
          width={0}
          height={0}
          sizes="100vw"
          quality={80}
          style={{ width: "100%", height: "14rem" }}
          className="rounded-t-lg"
        />
      </div>
    </div>
    <div className="p-5">
      <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-ellipsis line-clamp-2">
        {title}
      </p>
      <p className="mb-3 font-normal text-gray-700">By {author}</p>
      <Link
        href={`/blogs/${id.toString()}`}
        aria-label={`${title} by ${author}`}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-600"
      >
        Read Blog
        <svg
          className="w-3.5 h-3.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Link>
    </div>
  </div>
);

export { Card };
