import NoTableDataFound from '@/components/no-table-data-found';
import Pagination from '@/components/pagination';
import { CollectionsType } from '@/hooks/collection-api';
import {
  enumCleaner,
  formatIndianNumber,
  selectPillColor,
} from '@/utils/utils';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { TbEye } from 'react-icons/tb';
import classNames from 'classnames';

const PaymentDataTable = ({
  tableData,
  totalCollections,
  pageNumber,
  setPageNumber,
}: {
  tableData: CollectionsType[];
  totalCollections: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="mt-4 h-[90%]">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collection User
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Full Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Employer Name
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Payment Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Payment Mode</TableHeaderCell>
            <TableHeaderCell className="bg-white">Payment Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Reference No.
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Discount Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Settlement Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell>
                <Link
                  className="text-2xl cursor-pointer text-primaryColor"
                  href={`/customer_profile/${item.leadId}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{item.collectionUser}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              <TableCell>{item.employerName}</TableCell>
              <TableCell>
                {format(parseISO(item.repayDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.paymentAmount)}</TableCell>
              <TableCell>
                <Badge color={item.paymentMode === 'UPI' ? 'green' : 'indigo'}>
                  {item.paymentMode}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.paymentDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{item.referenceNo}</TableCell>
              <TableCell>{formatIndianNumber(item.discountAmount)}</TableCell>
              <TableCell>{formatIndianNumber(item.settlementAmount)}</TableCell>
              <TableCell>
                <Badge color={selectPillColor(enumCleaner(item.status))}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalCollections / 10) === 0
              ? 1
              : Math.ceil(totalCollections / 10)
          }
          totalItems={totalCollections}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default PaymentDataTable;
