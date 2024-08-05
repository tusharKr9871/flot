'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Title,
} from '@tremor/react';
import { TbEye, TbTrash } from 'react-icons/tb';
import ModalContainer from '../modal';
import { Dispatch, SetStateAction, useState } from 'react';
import { formatIndianNumber } from '@/utils/utils';
import Pagination from '../pagination';
import { format, parseISO } from 'date-fns';
import { BankUpdateLoansDataType, useBankUpdateLoans } from '@/hooks/loan-api';
import PrimaryCTA from '../primary-cta';
import SecondaryCTA from '../secondary-cta';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import * as Sentry from '@sentry/react';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import classNames from 'classnames';
import AddUTR from '@/app/(pages)/customer_profile/[lead_id]/approval-and-disbursal/disbursal/add-utr-disbursal-modal';

const BankUpdateTable = ({
  tableData,
  totalLeads,
  pageNumber,
  setPageNumber, // isEditable = true,
}: {
  tableData: BankUpdateLoansDataType[];
  totalLeads: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  // isEditable?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addUTRIsOpen, setAddUTRIsOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState<BankUpdateLoansDataType>();
  const { revalidateBankUpdateLoansData } = useBankUpdateLoans({ pageNumber });

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/loan/delete-bank-update/${defaultValue?.id}`,
      );
      revalidateBankUpdateLoansData();
      setLoading(false);
      setIsModalOpen(false);
      toast.success('Deleted Successfully!');
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="h-full mt-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No</TableHeaderCell>
            <TableHeaderCell className="bg-white">Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approval Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approval Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Account Number
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">ROI</TableHeaderCell>
            <TableHeaderCell className="bg-white">Tenure</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Processing Fee %
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Processing Fee
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Bank Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Bank Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">IFSC Code</TableHeaderCell>
            <TableHeaderCell className="bg-white">CIBIL</TableHeaderCell>
            <TableHeaderCell className="bg-white">Approved By</TableHeaderCell>
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
                  href={`/customer_profile/${item.leadId}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{item.loanType}</TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatIndianNumber(item.approvalAmount)}</TableCell>
              <TableCell>{formatIndianNumber(item.disbursalAmount)}</TableCell>
              <TableCell>
                {format(parseISO(item.approvalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{item.accountNumber}</TableCell>
              <TableCell>{item.roi}%</TableCell>
              <TableCell>{item.tenure}</TableCell>
              <TableCell>{item.processingFeePercent}%</TableCell>
              <TableCell>{formatIndianNumber(item.processingFee)}</TableCell>
              <TableCell>{item.bankName}</TableCell>
              <TableCell>{item.bankBranch}</TableCell>
              <TableCell>{item.ifscCode}</TableCell>
              <TableCell>{item.cibil}</TableCell>
              <TableCell>{item.approvedBy}</TableCell>
              <TableCell>
                <span
                  className="cursor-pointer text-2xl shadow-lg bg-blue-500 rounded-lg px-2 py-2 flex flex-row items-center justify-center"
                  onClick={() => {
                    setDefaultValue(item);
                    setAddUTRIsOpen(true);
                  }}>
                  <span className="text-sm text-white">Update UTR</span>
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="text-2xl text-red-600"
                  onClick={() => {
                    setDefaultValue(item);
                    setIsModalOpen(true);
                  }}>
                  <TbTrash />
                </span>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        styles="bg-white">
        <div>
          <Title className="pb-4">Do you want to delete this entry?</Title>
          <div className="flex flex-row justify-end items-center">
            <PrimaryCTA
              ctaText="Yes"
              icon="delete"
              onClick={onDelete}
              loading={loading}
            />
            <SecondaryCTA
              ctaText="Cancel"
              viewStyle="ml-2"
              onClick={() => setIsModalOpen(false)}
              disabled={!!loading}
            />
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={addUTRIsOpen}
        onClose={() => setAddUTRIsOpen(false)}
        styles="bg-white w-auto">
        <AddUTR
          leadId={defaultValue?.leadId || ''}
          setModalOpen={setAddUTRIsOpen}
        />
      </ModalContainer>
    </>
  );
};

export default BankUpdateTable;
