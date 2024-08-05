import {
  enumCleaner,
  formatIndianNumber,
  selectLoanPillColor,
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
import { TbCopy, TbEye } from 'react-icons/tb';
import { Dispatch, SetStateAction } from 'react';
import { Collections } from '@/hooks/collection-api';
import NoTableDataFound from '../no-table-data-found';
import Pagination from '../pagination';
import toast from 'react-hot-toast';
import classNames from 'classnames';

const AllCollectionsTable = ({
  tableData,
  totalLeads,
  pageNumber,
  setPageNumber,
}: {
  tableData: Collections[];
  totalLeads: number;
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
      <Table className="mt-4 h-full">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collection User
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Customer Name
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Mobile No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">Penalty</TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Remarks</TableHeaderCell>
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
                  href={`/customer_profile/${item.id}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>{item.collectionUser}</TableCell>
              <TableCell className="flex items-center">
                {item.loanNo}
                <TbCopy
                  className="text-primaryColor text-lg cursor-pointer ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(item.loanNo);
                    toast.success('Loan No. Copied!');
                  }}
                />
              </TableCell>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
              <TableCell>
                {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.repayAmount)}</TableCell>
              <TableCell>
                {format(parseISO(item.repayDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.penalty)}</TableCell>
              <TableCell>
                <Badge color={selectLoanPillColor(item.status)}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>{item.remarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalLeads / 10) === 0 ? 1 : Math.ceil(totalLeads / 10)
          }
          totalItems={totalLeads}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AllCollectionsTable;
