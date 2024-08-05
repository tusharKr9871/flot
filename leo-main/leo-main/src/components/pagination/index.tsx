import { useState } from 'react';
import SecondaryCTA from '../secondary-cta';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (pageNo: number) => void;
}) => {
  const [pageNumber, setPageNumber] = useState(currentPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const getDisplayPages = () => {
    const maxPageButtons = 5;
    const maxPagesToShow = 3;

    if (totalPages <= maxPageButtons) {
      return pageNumbers;
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const leftEllipsis = startPage > 1 ? [1, '...'] : [];
    const rightEllipsis = endPage < totalPages ? ['...', totalPages] : [];

    const displayPages = [
      ...leftEllipsis,
      ...pageNumbers.slice(startPage - 1, endPage),
      ...rightEllipsis,
    ];

    return displayPages;
  };

  return (
    <div className="flex items-center justify-between w-full mt-4 relative">
      <div className="flex flex-row">
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap items-center">
            {getDisplayPages().map((pageNumber, index) => (
              <li key={index}>
                {typeof pageNumber === 'number' ? (
                  <button
                    onClick={() => onPageChange(pageNumber)}
                    className={`${
                      pageNumber === currentPage
                        ? 'bg-secondaryColor text-white'
                        : 'bg-white text-secondaryColor'
                    } hover:bg-secondaryColor hover:text-white px-3 py-2 rounded-md mx-1 transition duration-300 ease-in-out`}>
                    {pageNumber}
                  </button>
                ) : (
                  <span className="mx-1 text-secondaryColor">{pageNumber}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center ml-4">
          <p className="text-gray-400">
            Showing {currentPage * 10 - 9} to{' '}
            {currentPage * 10 < totalItems
              ? currentPage * 10
              : 10 + (totalItems - currentPage * 10)}{' '}
            of {totalItems} items
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center  absolute right-0">
        <input
          type="number"
          data-input-counter
          value={pageNumber}
          onChange={e => setPageNumber(e.target.valueAsNumber)}
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 w-16 mr-2 border rounded-lg h-11 text-center text-gray-900 border-gray-300 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/[0.5] py-2.5"
          required
        />
        <SecondaryCTA
          ctaText="Go"
          onClick={() => onPageChange(pageNumber)}
          viewStyle="h-11"
        />
      </div>
    </div>
  );
};

export default Pagination;
