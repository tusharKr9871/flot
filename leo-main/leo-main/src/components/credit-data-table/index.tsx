import {
  enumCleaner,
  formatIndianNumber,
  selectPillColor,
  truncateText,
} from '@/utils/utils';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Subtitle,
} from '@tremor/react';
import { TbEye } from 'react-icons/tb';
import ModalContainer from '../modal';
import PrimaryCTA from '../primary-cta';
import SecondaryCTA from '../secondary-cta';
import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { DisbursalLeadsType } from '@/hooks/leads-api';
import Pagination from '../pagination';
import { format, parseISO } from 'date-fns';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';

const CreditTable = ({
  tableData,
  totalLeads,
  isEditable,
  pageNumber,
  setPageNumber,
  disbursal = false,
  approved = false,
}: {
  tableData: DisbursalLeadsType[];
  totalLeads: number;
  isEditable?: boolean;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  disbursal?: boolean;
  approved?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<string>('');

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const changeStatusToRejected = async () => {
    try {
      await axiosInstance.put(`/approval/update/${editItemId}`, {
        status: 'Rejected',
      });
      toast.success('Status changed to Rejected!');
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
    }
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
            {(disbursal || approved) && (
              <TableHeaderCell className="bg-white">Loan No</TableHeaderCell>
            )}
            <TableHeaderCell className="bg-white">Loan Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">Full Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No.</TableHeaderCell>
            {disbursal && (
              <TableHeaderCell className="bg-white">
                Reference No.
              </TableHeaderCell>
            )}
            {disbursal && (
              <TableHeaderCell className="bg-white">
                Disbursal Amount
              </TableHeaderCell>
            )}
            {disbursal && (
              <TableHeaderCell className="bg-white">
                Disbursal Date
              </TableHeaderCell>
            )}
            <TableHeaderCell className="bg-white">
              Approval Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Tenure</TableHeaderCell>
            <TableHeaderCell className="bg-white">ROI</TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
            <TableHeaderCell className="bg-white">Admin Fee</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Monthly Income
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">CIBIL</TableHeaderCell>
            <TableHeaderCell className="bg-white">Credited by</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approval Status
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
            <TableHeaderCell className="bg-white">Updated At</TableHeaderCell>
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
              {(disbursal || approved) && <TableCell>{item.loanNo}</TableCell>}
              <TableCell>
                <Badge color={item.loanType === 'payday' ? 'orange' : 'green'}>
                  {item.loanType}
                </Badge>
              </TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{truncateText(item.email, 20)}</TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              {disbursal && <TableCell>{item.referenceNo}</TableCell>}
              {disbursal && (
                <TableCell>
                  {formatIndianNumber(item.disbursalAmount)}
                </TableCell>
              )}
              {disbursal && (
                <TableCell>
                  {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
                </TableCell>
              )}
              <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
              <TableCell>{item.tenure}</TableCell>
              <TableCell>{item.roi}%</TableCell>
              <TableCell>
                {format(parseISO(item.repayDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.processingFee)}</TableCell>
              <TableCell>{formatIndianNumber(item.monthlyIncome)}</TableCell>
              <TableCell>{item.cibil}</TableCell>
              <TableCell>{item.creditedBy}</TableCell>
              <TableCell>
                <Badge
                  color={selectPillColor(enumCleaner(item.status))}
                  onClick={() => {
                    if (isEditable) {
                      setIsOpen(true);
                      setEditItemId(item.id);
                    }
                  }}
                  className={classNames(isEditable && 'cursor-pointer')}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.updatedAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
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
      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white">
        <Subtitle>Change status to Rejected?</Subtitle>
        <div className="mt-4 flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Yes"
            onClick={changeStatusToRejected}
            viewStyle="mr-4 w-12 items-center justify-center flex"
          />
          <SecondaryCTA
            ctaText="No"
            onClick={() => setIsOpen(false)}
            viewStyle="w-12 items-center justify-center flex"
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default CreditTable;
