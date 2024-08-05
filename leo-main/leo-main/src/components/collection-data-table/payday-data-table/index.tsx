'use client';

import Checkbox from '@/components/checkbox';
import InputSelect, { Option } from '@/components/input-select';
import ModalContainer from '@/components/modal';
import Pagination from '@/components/pagination';
import PrimaryCTA from '@/components/primary-cta';
import { useAuth } from '@/context/AuthContextProvider';
import { PendingLoansDataType, usePendingLoans } from '@/hooks/loan-api';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import { axiosInstance } from '@/network/axiosInstance';
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
  Divider,
  Title,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TbCopy, TbEye, TbPencil, TbPencilCancel } from 'react-icons/tb';
import * as Sentry from '@sentry/react';
import Link from 'next/link';
import NoTableDataFound from '@/components/no-table-data-found';
import classNames from 'classnames';

const PaydayPendingTable = ({
  tableData,
  totalLeads,
  pageNumber,
  setPageNumber,
  assigneeId,
  setAssigneeId,
}: {
  tableData: PendingLoansDataType[];
  totalLeads: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  assigneeId: string;
  setAssigneeId: Dispatch<SetStateAction<string>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [callingTeam, setCallingTeam] = useState<Option[]>([]);
  const [changeAssignee, setChangeAssignee] = useState(false);
  const { usersByRoleAndBranchData: creditManager } =
    useFetchUsersByRoleAndBranch({
      role: 'Credit_Manager',
      branch: 'Delhi',
    });
  const { usersByRoleAndBranchData: loanOfficers } =
    useFetchUsersByRoleAndBranch({
      role: 'Loan_Officer',
      branch: 'Delhi',
    });
  const [role, setRole] = useState(
    user?.role === 'Credit_Manager' ? 'Tele_Caller' : 'Collection_Executive',
  );
  const [selectedUser, setSelectedUser] = useState('');
  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role: role,
    branch: 'Delhi',
  });
  const { revalidatePendingLoansData } = usePendingLoans({
    pageNumber: pageNumber,
    loanFilter: 'payday',
  });
  useEffect(() => {
    if (creditManager && loanOfficers) {
      const filteredTeleCallers = creditManager.filter(
        officer => officer.label !== 'None',
      );
      const callingTeam = filteredTeleCallers.concat(loanOfficers);
      setCallingTeam(callingTeam);
    }
  }, [loanOfficers, creditManager]);

  useEffect(() => {
    if (selectedLeads.length === 0) {
      setRole(
        user?.role === 'Credit_Manager'
          ? 'Tele_Caller'
          : 'Collection_Executive',
      );
      setSelectedUser('');
    }
  }, [selectedLeads.length, user?.role]);

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  const handleSelectAll = () => {
    if (selectedLeads.length === tableData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(tableData.map(item => item.leadId));
    }
  };

  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(item => item !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const handleReminderEmail = async ({ days }: { days: number }) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/loan/send-reminder-email?days=${days}`);
      toast.success('Reminder Email sent');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Sentry.captureException(error);
      toast.error('Something went wrong!');
    }
  };

  const assignCollectionUser = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/loan-collection/assign-leads', {
        userId: selectedUser,
        leadsId: selectedLeads,
      });
      toast.success('Leads assigned for collection!');
      setLoading(false);
      setSelectedLeads([]);
      setOpenAssignmentModal(false);
      revalidatePendingLoansData();
    } catch (error) {
      setLoading(false);
      Sentry.captureException(error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <div className="mr-4">
        <PrimaryCTA
          ctaText="Assign Collection"
          onClick={() => setOpenAssignmentModal(true)}
          disabled={
            selectedLeads.length === 0 ||
            user?.role === 'Tele_Caller' ||
            user?.role === 'Collection_Executive'
          }
        />
        {selectedLeads.length !== 0 && (
          <Badge className="mt-4 text-sm" color="teal">
            {selectedLeads.length > 0 && selectedLeads.length + ' selected'}
          </Badge>
        )}
      </div>
      <div className="flex flex-row w-full mt-4 justify-end">
        <div className="mr-4">
          <PrimaryCTA
            ctaText="7 Days Reminder"
            onClick={async () => handleReminderEmail({ days: 8 })}
            loading={loading}
          />
        </div>
        <div className="mr-4">
          <PrimaryCTA
            ctaText="5 Days Reminder"
            onClick={async () => handleReminderEmail({ days: 6 })}
            loading={loading}
          />
        </div>
        <div className="mr-4">
          <PrimaryCTA
            ctaText="3 Days Reminder"
            onClick={async () => handleReminderEmail({ days: 4 })}
            loading={loading}
          />
        </div>
        <div className="mr-4">
          <PrimaryCTA
            ctaText="Today Reminder"
            onClick={async () => handleReminderEmail({ days: 2 })}
            loading={loading}
          />
        </div>
      </div>
      <Table className="mt-4 h-full">
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              {selectedLeads.length > 0 && assigneeId && (
                <Checkbox
                  label=""
                  onChange={handleSelectAll}
                  value={selectedLeads.length === tableData.length}
                />
              )}
            </TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">DPD</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No</TableHeaderCell>
            <TableHeaderCell className="bg-white flex flex-row items-center">
              {changeAssignee || assigneeId ? (
                <div>
                  <InputSelect
                    value={assigneeId}
                    onChange={setAssigneeId}
                    options={callingTeam}
                    styles="w-1/4 font-normal [&&]:mb-0"
                  />
                </div>
              ) : (
                'Credited By'
              )}
              <span
                className="text-lg ml-2"
                onClick={() => setChangeAssignee(val => !val)}>
                {changeAssignee ? <TbPencilCancel /> : <TbPencil />}
              </span>
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Collection</TableHeaderCell>
            <TableHeaderCell className="bg-white">Full Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">Tenure</TableHeaderCell>
            <TableHeaderCell className="bg-white">ROI</TableHeaderCell>
            <TableHeaderCell className="bg-white">Repay Amount</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Repay Amount ({format(new Date(), 'dd-MM-yyyy')})
            </TableHeaderCell>
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
                <Checkbox
                  label=""
                  onChange={() => {
                    handleSelectLead(item.leadId);
                  }}
                  value={selectedLeads.includes(item.leadId) ? true : false}
                />
              </TableCell>
              <TableCell>
                <Link
                  className="text-2xl cursor-pointer text-primaryColor"
                  href={`/customer_profile/${item.leadId}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>
                {item.daysPastDue < 0 ? 'N/A' : item.daysPastDue + ' Days'}
              </TableCell>
              <TableCell className="flex flex-row items-center">
                {item.loanNo}
                <TbCopy
                  className="text-primaryColor text-lg cursor-pointer ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(item.loanNo);
                    toast.success('Loan No. Copied!');
                  }}
                />
              </TableCell>
              <TableCell>{item.creditedBy}</TableCell>
              <TableCell>{item.collectionUser}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
              <TableCell>{item.tenure}</TableCell>
              <TableCell>{item.roi}%</TableCell>
              <TableCell>{formatIndianNumber(item.repaymentAmount)}</TableCell>
              <TableCell>
                {formatIndianNumber(item.currentRepaymentAmount)}
              </TableCell>
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
        {!assigneeId && (
          <Pagination
            currentPage={pageNumber}
            totalPages={
              Math.ceil(totalLeads / 10) === 0 ? 1 : Math.ceil(totalLeads / 10)
            }
            totalItems={totalLeads}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <ModalContainer
        isOpen={openAssignmentModal}
        onClose={() => setOpenAssignmentModal(false)}
        styles="bg-white min-w-[18rem]">
        <div className="">
          <Title className="pb-4">Choose Reporting</Title>
          <div>
            <InputSelect
              label="Role"
              value={role}
              onChange={setRole}
              options={[
                {
                  key: '1',
                  value: 'Collection_Executive',
                  label: 'Collection Executive',
                },
                {
                  key: '2',
                  value: 'Tele_Caller',
                  label: 'Tele Caller',
                },
              ]}
              disabled={!!loading}
            />
            <InputSelect
              label="User"
              value={selectedUser}
              onChange={setSelectedUser}
              options={usersByRoleAndBranchData || []}
              disabled={!!loading}
            />
            <Divider />
            <div className="flex justify-end w-full">
              <PrimaryCTA
                ctaText="Assign"
                onClick={assignCollectionUser}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default PaydayPendingTable;
