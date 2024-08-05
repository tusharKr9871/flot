import { CollectionReportType } from '@/hooks/reports-api';
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
  TableCell,
  Badge,
  TableBody,
} from '@tremor/react';
import { Dispatch, SetStateAction } from 'react';
import Pagination from '../pagination';
import { format, parseISO } from 'date-fns';
import { TbEye } from 'react-icons/tb';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import { useAuth } from '@/context/AuthContextProvider';
import classNames from 'classnames';

const ReportCollectionDataTable = ({
  tableData,
  totalCount,
  pageNumber,
  setPageNumber,
}: {
  tableData: CollectionReportType[];
  totalCount: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };
  const { user } = useAuth();
  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="mt-4 h-[90%]">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Full Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Mobile</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Employer Name
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Processing Fee
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collected Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Penalty</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collected Mode
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collected Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collected Time
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Reference No.
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Total Collection
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Remarks</TableHeaderCell>
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
                  {user?.role !== 'Service' && <TbEye />}
                </Link>
              </TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.mobile}</TableCell>
              <TableCell>{item.employerName}</TableCell>
              <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
              <TableCell>{formatIndianNumber(item.processingFee)}</TableCell>
              <TableCell>
                {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.collectedAmount)}</TableCell>
              <TableCell>{item.penalty}</TableCell>
              <TableCell>
                <Badge
                  color={item.collectedMode === 'UPI' ? 'green' : 'indigo'}>
                  {item.collectedMode}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.collectionDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{item.collectionTime}</TableCell>
              <TableCell>{item.referenceNo}</TableCell>
              <TableCell>
                {formatIndianNumber(item.totalCollectionAmount)}
              </TableCell>
              <TableCell>
                <Badge color={selectPillColor(enumCleaner(item.status))}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>{item.remark}</TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row items-center">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalCount / 10) === 0 ? 1 : Math.ceil(totalCount / 10)
          }
          totalItems={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ReportCollectionDataTable;
