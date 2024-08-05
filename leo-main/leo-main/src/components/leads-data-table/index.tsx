'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Title,
  Divider,
} from '@tremor/react';
import {
  TbEdit,
  TbEditCircle,
  TbEye,
  TbPencil,
  TbPencilCancel,
} from 'react-icons/tb';
import ModalContainer from '../modal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { enumCleaner, selectPillColor, truncateText } from '@/utils/utils';
import InputSelect, { Option } from '../input-select';
import PrimaryCTA from '../primary-cta';
import { format, parseISO } from 'date-fns';
import CustomerDetailsModal from '@/app/(pages)/leads/all_leads/customer-details-modal';
import { useAuth } from '@/context/AuthContextProvider';
import Pagination from '../pagination';
import { LeadDataType, useFetchLeads } from '@/hooks/leads-api';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import classNames from 'classnames';

export type LeadsDataType = LeadDataType & {
  customerId: string;
  customerName: string;
  email: string;
  phoneNo: string;
  ip: string;
  updatedAt: string;
};

const LeadsDataTable = ({
  tableData,
  totalLeads,
  isEditable = true,
  pageNumber,
  setPageNumber,
  assigneeId,
  setAssigneeId,
  creditManagerId,
  setCreditManagerId,
}: {
  tableData: LeadsDataType[];
  totalLeads: number;
  isEditable?: boolean;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  assigneeId: string;
  setAssigneeId: Dispatch<SetStateAction<string>>;
  creditManagerId: string;
  setCreditManagerId: Dispatch<SetStateAction<string>>;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCreditManagerOpen, setIsEditCreditManagerOpen] = useState(false);
  const [loading, isLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [callingTeam, setCallingTeam] = useState<Option[]>([]);
  const [creditTeam, setCreditTeam] = useState<Option[]>([]);
  const [changeAssignee, setChangeAssignee] = useState(false);
  const [changeCreditManager, setChangeCreditManager] = useState(false);
  const [lead, setLead] = useState<LeadsDataType>();
  const { usersByRoleAndBranchData: teleCallers } =
    useFetchUsersByRoleAndBranch({
      role: 'Tele_Caller',
      branch: 'Delhi',
    });
  const { usersByRoleAndBranchData: loanOfficers } =
    useFetchUsersByRoleAndBranch({
      role: 'Loan_Officer',
      branch: 'Delhi',
    });

  const { usersByRoleAndBranchData: creditManager } =
    useFetchUsersByRoleAndBranch({
      role: 'Credit_Manager',
      branch: 'Delhi',
    });
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedCreditManager, setSelectedCreditManager] = useState('');
  const { revalidateLeads } = useFetchLeads({ pageNumber });
  const { user } = useAuth();

  useEffect(() => {
    if (teleCallers && loanOfficers) {
      const filteredTeleCallers = teleCallers.filter(
        officer => officer.label !== 'None',
      );
      const callingTeam = filteredTeleCallers.concat(loanOfficers);
      setCallingTeam(callingTeam);
    }
  }, [loanOfficers, teleCallers]);

  useEffect(() => {
    if (creditManager) {
      const filteredCreditManager = creditManager.filter(
        officer => officer.label !== 'None',
      );
      setCreditTeam(filteredCreditManager);
    }
  }, [creditManager]);

  const onChangeAssignee = async () => {
    try {
      isLoading(true);
      await axiosInstance.put(`/leads/update/lead_assignee/${lead?.id}`, {
        leadAssignee: selectedAssignee,
      });
      toast.success('Assignee Updated!');
      setIsEditModalOpen(false);
      revalidateLeads();
      isLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      isLoading(false);
    }
  };

  const onChangeCreditManager = async () => {
    try {
      isLoading(true);
      await axiosInstance.put(`/leads/update/credit_manager/${lead?.id}`, {
        creditManager: selectedCreditManager,
      });
      toast.success('Credit Manager Updated!');
      setIsEditCreditManagerOpen(false);
      revalidateLeads();
      isLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      isLoading(false);
    }
  };

  const onView = (option: LeadsDataType) => {
    setLead(option);
    setViewModalOpen(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  if (tableData.length === 0 && assigneeId.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="h-[90%] mt-4">
        <TableHead>
          <TableRow className="bg-white border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            {user?.role === 'Admin' && (
              <>
                <TableHeaderCell className="bg-white">
                  <div className="flex items-center">
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
                      'Lead Assignee'
                    )}
                    <span
                      className="text-lg ml-2"
                      onClick={() => setChangeAssignee(val => !val)}>
                      {changeAssignee ? <TbPencilCancel /> : <TbPencil />}
                    </span>
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className="bg-white">
                  <div className="flex items-center">
                    {changeCreditManager || creditManagerId ? (
                      <div>
                        <InputSelect
                          value={creditManagerId}
                          onChange={setCreditManagerId}
                          options={creditTeam}
                          styles="w-1/4 font-normal [&&]:mb-0"
                        />
                      </div>
                    ) : (
                      'Credit Manager'
                    )}
                    <span
                      className="text-lg ml-2"
                      onClick={() => setChangeCreditManager(val => !val)}>
                      {changeCreditManager ? <TbPencilCancel /> : <TbPencil />}
                    </span>
                  </div>
                </TableHeaderCell>
              </>
            )}
            <TableHeaderCell className="bg-white">
              Customer Name
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Required Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Monthly Income
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">City</TableHeaderCell>
            <TableHeaderCell className="bg-white">State</TableHeaderCell>
            <TableHeaderCell className="bg-white">Pincode</TableHeaderCell>
            <TableHeaderCell className="bg-white">UTM Source</TableHeaderCell>
            <TableHeaderCell className="bg-white">Domain</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Customer Status
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
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
              {item.status === 'Fresh_Lead' || item.status === 'Interested' ? (
                <TableCell>
                  <span
                    className="text-2xl cursor-pointer"
                    onClick={() => onView(item)}>
                    <TbEditCircle />
                  </span>
                </TableCell>
              ) : (
                <TableCell></TableCell>
              )}
              {user?.role === 'Admin' && (
                <>
                  <TableCell>
                    <div className="flex items-center">
                      {item.leadAssignee}
                      {isEditable && (
                        <span
                          className="text-2xl cursor-pointer ml-2"
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setLead(item);
                          }}>
                          <TbEdit />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.creditManager}
                      {isEditable && (
                        <span
                          className="text-2xl cursor-pointer ml-2"
                          onClick={() => {
                            setIsEditCreditManagerOpen(true);
                            setLead(item);
                          }}>
                          <TbEdit />
                        </span>
                      )}
                    </div>
                  </TableCell>
                </>
              )}
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{truncateText(item.email, 20)}</TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              <TableCell>{item.loanRequired}</TableCell>
              <TableCell>{item.monthlyIncome}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.state}</TableCell>
              <TableCell>{item.pincode}</TableCell>
              <TableCell>{item.utmSource}</TableCell>
              <TableCell>{item.domain}</TableCell>
              <TableCell>
                <Badge
                  color={
                    item.loanCount === 'Fresh_Customer' ? 'yellow' : 'blue'
                  }>
                  {enumCleaner(item.loanCount)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge color={selectPillColor(enumCleaner(item.status))}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd/MM/yy hh:mm:ss')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.updatedAt), 'dd/MM/yy hh:mm:ss')}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        styles="bg-white">
        <div className="">
          <Title className="pb-4">Choose Assignee</Title>
          <div>
            <InputSelect
              label="Assignee"
              value={selectedAssignee}
              //@ts-ignore
              onChange={setSelectedAssignee}
              options={callingTeam}
              disabled={!!loading}
            />
            <Divider />
            <div className="flex justify-end w-full">
              <PrimaryCTA
                ctaText="Update"
                onClick={onChangeAssignee}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isEditCreditManagerOpen}
        onClose={() => setIsEditCreditManagerOpen(false)}
        styles="bg-white">
        <div className="">
          <Title className="pb-4">Choose Credit Manager</Title>
          <div>
            <InputSelect
              label="Assignee"
              value={selectedCreditManager}
              //@ts-ignore
              onChange={setSelectedCreditManager}
              options={creditTeam}
              disabled={!!loading}
            />
            <Divider />
            <div className="flex justify-end w-full">
              <PrimaryCTA
                ctaText="Update"
                onClick={onChangeCreditManager}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        styles="flex md:w-[60%] w-[90%] flex-col bg-white">
        <CustomerDetailsModal
          leadId={lead?.id || ''}
          pageNumber={pageNumber}
          setViewModalOpen={setViewModalOpen}
        />
      </ModalContainer>
    </>
  );
};

export default LeadsDataTable;
