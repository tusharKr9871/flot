import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import Pagination from '../pagination';
import NoTableDataFound from '../no-table-data-found';
import { CibilDataType } from '@/hooks/reports-api';
import { aadhaarFormatter, formatIndianNumber } from '@/utils/utils';
import Link from 'next/link';
import { TbEye } from 'react-icons/tb';
import classNames from 'classnames';

const CibilDataTable = ({
  tableData,
  total,
  pageNumber,
  setPageNumber,
}: {
  tableData: CibilDataType[];
  total: number;
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
          <TableRow className="border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Consumer Name
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Date of Birth
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Gender</TableHeaderCell>
            <TableHeaderCell className="bg-white">Pan</TableHeaderCell>
            <TableHeaderCell className="bg-white">Aadhar</TableHeaderCell>
            <TableHeaderCell className="bg-white">Mobile</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Address</TableHeaderCell>
            <TableHeaderCell className="bg-white">City</TableHeaderCell>
            <TableHeaderCell className="bg-white">State</TableHeaderCell>
            <TableHeaderCell className="bg-white">Pincode</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Collection Status
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Closure Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Current Balance
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Amount Overdue
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Overdue Days</TableHeaderCell>
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
              <TableCell>{item.name}</TableCell>
              <TableCell>{format(parseISO(item.dob), 'dd-MM-yyyy')}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.pan}</TableCell>
              <TableCell>{aadhaarFormatter(item.aadhar)}</TableCell>
              <TableCell>{item.mobile}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.state}</TableCell>
              <TableCell>{item.pincode}</TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{formatIndianNumber(item.amount)}</TableCell>
              <TableCell>
                {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.repaymentDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>
                <Badge
                  color={
                    item.collectionStatus === 'Pending'
                      ? 'orange'
                      : item.collectionStatus === 'Closed'
                      ? 'green'
                      : 'yellow'
                  }>
                  {item.collectionStatus}
                </Badge>
              </TableCell>
              <TableCell>{item.closureDate}</TableCell>
              <TableCell>{formatIndianNumber(item.currentBalance)}</TableCell>
              <TableCell>{formatIndianNumber(item.amountOverdue)}</TableCell>
              <TableCell>
                {item.overDueDays <= 0 ? 'N/A' : item.overDueDays}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={Math.ceil(total / 10) === 0 ? 1 : Math.ceil(total / 10)}
          totalItems={total}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default CibilDataTable;
