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
import { TbCheck, TbEye, TbX } from 'react-icons/tb';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import { WaiverRequest, useFetchWaiverRequests } from '@/hooks/collection-api';
import { formatIndianNumber } from '@/utils/utils';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import * as Sentry from '@sentry/react';
import classNames from 'classnames';

const WaiverRequestsTable = ({
  tableData,
  total,
  pageNumber,
  setPageNumber,
}: {
  tableData: WaiverRequest[];
  total: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const { revalidateWaiverRequests } = useFetchWaiverRequests({
    pageNumber,
    searchTerm: '',
  });

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  const updateWaiverRequestStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.put(`/collection/update-waiver-request/${id}`, {
        status,
      });
      toast.success('Waiver request updated successfully');
      revalidateWaiverRequests();
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Table className="mt-4 h-full">
        <TableHead>
          <TableRow className="border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">DPD</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approval Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">Penalty</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Waiver Amount Type
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Waiver Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Actual Repayment Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
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
              <TableCell>
                {item.daysPastDue < 0 ? 'N/A' : item.daysPastDue + ' Days'}
              </TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{formatIndianNumber(item.approvalAmount)}</TableCell>
              <TableCell>{formatIndianNumber(item.repayAmount)}</TableCell>
              <TableCell>
                {format(parseISO(item.repayDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.penalty)}</TableCell>
              <TableCell>{item.waiverAmountType}</TableCell>
              <TableCell>{formatIndianNumber(item.waiverAmount)}</TableCell>
              <TableCell>
                {formatIndianNumber(item.actualRepaymentAmount)}
              </TableCell>
              <TableCell>
                <Badge
                  color={
                    item.status === 'Requested'
                      ? 'yellow'
                      : item.status === 'Accepted'
                      ? 'green'
                      : 'red'
                  }>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {(item.status === 'Requested' ||
                  item.status === 'Rejected') && (
                  <>
                    <div
                      className="flex flex-row items-center justify-between cursor-pointer"
                      onClick={async () =>
                        updateWaiverRequestStatus(item.id, 'Accepted')
                      }>
                      <span className="w-10 h-8">
                        <TbCheck className="bg-green-400 h-full w-full text-white rounded-lg mr-2" />
                      </span>
                    </div>
                  </>
                )}
              </TableCell>
              <TableCell>
                {(item.status === 'Accepted' ||
                  item.status === 'Requested') && (
                  <div
                    className="flex flex-row items-center justify-between cursor-pointer"
                    onClick={async () =>
                      updateWaiverRequestStatus(item.id, 'Rejected')
                    }>
                    <span className="w-10 h-8">
                      <TbX className="bg-red-400 h-full w-full text-white rounded-lg" />
                    </span>
                  </div>
                )}
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

export default WaiverRequestsTable;
