import DateSelect from '@/components/date-select';
import InputSelect from '@/components/input-select';
import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { useLoanApproval, usePdVisitLetter } from '@/hooks/approval-api';
import { useFetchLead } from '@/hooks/leads-api';
import { axiosInstance } from '@/network/axiosInstance';
import { formatIndianNumber, selectPillColor } from '@/utils/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Card, Divider, Metric } from '@tremor/react';
import { format, parse, parseISO } from 'date-fns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import * as Sentry from '@sentry/react';
import { useAuth } from '@/context/AuthContextProvider';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import TimePicker from '@/components/time-picker';
import { TbCopy, TbEdit } from 'react-icons/tb';
import SanctionLetter from './sanction-letter';
import CreateApproval from './create-approval';
import UpdateApproval from './update-approval';
import UpdateCreditedBy from './update-credited-by';
import Tooltip from '@/components/tooltip';
import { useFetchClient } from '@/hooks/clients-api';
import CreateEMIApproval from './create-emi-approval';

type pdMailFormType = {
  pdId: string;
  pdDate: Date;
  pdTime: string;
};
const pdMailValidationSchema = yup.object().shape({
  pdId: yup.string().required('pd id is required'),
  pdDate: yup.date().required('pd Date is required'),
  pdTime: yup.string().required('pd Time is required'),
});

const ApprovalDetails = ({ leadId }: { leadId: string }) => {
  const [isCreateApprovalOpen, setIsCreateApprovalOpen] = useState(false);
  const [isOpenVisitMail, setIsOpenVisitMail] = useState(false);
  const [updateIsOpen, setUpdateIsOpen] = useState(false);
  const [editRepayDate, setEditRepayDate] = useState(false);
  const [showSL, setShowSL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateCreditedByOpen, setIsUpdateCreditedByOpen] = useState(false);
  const { user } = useAuth();

  const { loanApprovalData, isFetchingLoanApprovalData } = useLoanApproval({
    leadId,
  });
  const { pdVisitLetterData, revalidatePdVisitLetterData } = usePdVisitLetter({
    leadId,
  });
  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role: 'PD_Team',
    branch: loanApprovalData?.branch || '',
  });
  const { clientData, isFetchingClientData } = useFetchClient();
  const { leadData } = useFetchLead({ leadId });

  const {
    control: sendPdMailControl,
    handleSubmit: pdMailHandleSubmit,
    formState: { errors: pdMailErrors },
  } = useForm<pdMailFormType>({
    resolver: yupResolver(pdMailValidationSchema),
  });

  // * send sanction letter and approval email
  const sendEmail = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/approval/send-approval-email/${leadId}`, {
        officialEmail: loanApprovalData?.email,
      });
      toast.success('Sanction email sent successfully!');
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Could not send email!');
      setLoading(false);
    }
  };

  const sendVisitAlignEmail = async (data: pdMailFormType) => {
    try {
      setLoading(true);
      if (pdVisitLetterData) {
        await axiosInstance.put(`/pd-visit/update/${leadId}`, {
          pdId: data.pdId,
          pdDate: parse(
            format(data.pdDate, 'dd-MM-yyyy'),
            'dd-MM-yyyy',
            new Date(),
          ),
          pdTime: data.pdTime,
        });
      } else {
        await axiosInstance.post(`/pd-visit/add/${leadId}`, {
          pdId: data.pdId,
          pdDate: parse(
            format(data.pdDate, 'dd-MM-yyyy'),
            'dd-MM-yyyy',
            new Date(),
          ),
          pdTime: data.pdTime,
        });
      }
      toast.success('pd visit mail sent successfully!');
      setIsOpenVisitMail(false);
      revalidatePdVisitLetterData();
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Could not send email!');
      setLoading(false);
    }
  };

  if (isFetchingLoanApprovalData || isFetchingClientData) {
    return (
      <Card className="mt-4">
        <p className="text-tremor-title font-semibold">Approval Details</p>
        <div className="grid-cols-3 grid mt-6 animate-pulse">
          {Array.from({ length: 12 }, (_, index) => (
            <div className="my-2 flex-col flex" key={index}>
              <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row">
            <p className="text-tremor-title font-semibold mr-2">
              Credit Approval Details
            </p>
            <Tooltip
              content={`Want to change the repay date? or Credited By? \n Contact an Admin`}>
              <button
                type="button"
                className="text-white h-6 w-6 flex items-center justify-center hover:bg-gray-400 bg-gray-800 font-medium rounded-full text-base p-3 text-center">
                ?
              </button>
            </Tooltip>
          </div>

          <div className="flex flex-row">
            {loanApprovalData ? (
              <div className="flex flex-row">
                {((loanApprovalData.status === 'Approved' &&
                  leadData?.status === 'Approved') ||
                  loanApprovalData.status === 'Rejected') &&
                  user?.role !== 'Tele_Caller' && (
                    <PrimaryCTA
                      ctaText="Update"
                      icon="plus"
                      onClick={() => {
                        setUpdateIsOpen(true);
                        setEditRepayDate(false);
                      }}
                    />
                  )}
                {loanApprovalData.status === 'Approved' &&
                  user?.role !== 'Tele_Caller' && (
                    <PrimaryCTA
                      ctaText="Show Breakdown"
                      onClick={() => setShowSL(true)}
                      viewStyle="ml-2"
                      loading={loading}
                    />
                  )}
                {loanApprovalData.status === 'Approved' &&
                  leadData?.status === 'Approved' &&
                  user?.role !== 'Tele_Caller' && (
                    <PrimaryCTA
                      ctaText="Send S.L."
                      icon="send"
                      onClick={sendEmail}
                      viewStyle="ml-2"
                      loading={loading}
                      disabled={!!loading}
                    />
                  )}
              </div>
            ) : (
              leadData?.status === 'Documents_Received' &&
              user?.role !== 'Tele_Caller' && (
                <PrimaryCTA
                  ctaText="Add"
                  icon="plus"
                  onClick={() => setIsCreateApprovalOpen(true)}
                />
              )
            )}
            {leadData?.status === 'Documents_Received' && (
              <PrimaryCTA
                ctaText="Send PD visit Mail"
                icon="send"
                onClick={() => setIsOpenVisitMail(true)}
                viewStyle="ml-2"
                loading={loading}
              />
            )}
          </div>
        </div>
        {pdVisitLetterData && (
          <div className="flex flex-row mt-6">
            <p>
              Visit Scheduled for{' '}
              <span className="font-semibold">
                {format(parseISO(pdVisitLetterData.visitDate), 'dd-MM-yyyy')}
              </span>{' '}
              at{' '}
              <span className="font-semibold">
                {pdVisitLetterData.visitTime}
              </span>{' '}
              by{' '}
              <span className="font-semibold">{pdVisitLetterData.pdName}</span>
            </p>
            {(leadData?.status === 'Documents_Received' ||
              leadData?.status === 'Approved') && (
              <p
                className="underline text-sm ml-4 cursor-pointer"
                onClick={() => setIsOpenVisitMail(true)}>
                Update Visit Mail
              </p>
            )}
          </div>
        )}
        {!loanApprovalData ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Credit Details Found!
            </Metric>
          </div>
        ) : (
          <div className="grid-cols-3 grid mt-6">
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Loan No
              </span>
              <div className="flex flex-row items-center">
                <span className="text-sm font-medium">
                  {loanApprovalData.loanNo}
                </span>
                <TbCopy
                  className="text-primaryColor text-lg cursor-pointer ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(loanApprovalData.loanNo);
                    toast.success('Loan No. Copied!');
                  }}
                />
              </div>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Loan Type
              </span>
              <span className="text-sm font-medium">
                <Badge
                  color={
                    loanApprovalData.loanType === 'payday' ? 'orange' : 'purple'
                  }>
                  {loanApprovalData.loanType}
                </Badge>
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Branch
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.branch}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Approval Amount
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(loanApprovalData.approvalAmount)}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Loan Tenure
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.loanTenure}{' '}
                {loanApprovalData.loanType === 'emi' ? 'months' : 'days'}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                ROI
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.roi}%
              </span>
            </div>
            {loanApprovalData.loanType !== 'emi' && (
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Salary Date
                </span>
                <span className="text-sm font-medium">
                  {loanApprovalData.salaryDate}
                </span>
              </div>
            )}
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                {loanApprovalData.loanType === 'emi'
                  ? 'Final Repay Date'
                  : 'Repay Date'}
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {format(parseISO(loanApprovalData.repayDate), 'dd-MM-yyyy')}
                </span>
                {loanApprovalData.status === 'Approved' &&
                  user?.role === 'Admin' && (
                    <TbEdit
                      className="text-primaryColor ml-1 cursor-pointer"
                      onClick={() => {
                        setUpdateIsOpen(true);
                        setEditRepayDate(true);
                      }}
                    />
                  )}
              </div>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Processing Fee %
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.processingFeePercent}%
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Processing Fee
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(loanApprovalData.processingFee)}
              </span>
            </div>
            {loanApprovalData.loanType === 'emi' && (
              <>
                <div className="my-2 flex-col flex">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Conversion Fee %
                  </span>
                  <span className="text-sm font-medium">
                    {loanApprovalData.conversionFeesPercent}%
                  </span>
                </div>
                <div className="my-2 flex-col flex">
                  <span className="text-xs font-medium text-gray-400 mb-1">
                    Conversion Fee
                  </span>
                  <span className="text-sm font-medium">
                    {formatIndianNumber(loanApprovalData.conversionFees)}
                  </span>
                </div>
              </>
            )}
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                GST%
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.gst}%
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Alternate Number
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.alternateNumber}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Email
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.email}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Cibil
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.cibilScore}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Monthly Income
              </span>
              <span className="text-sm font-medium">
                {formatIndianNumber(loanApprovalData.monthlyIncome)}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Status
              </span>
              <span className="text-sm font-medium">
                <Badge color={selectPillColor(loanApprovalData.status)}>
                  {loanApprovalData.status}
                </Badge>
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Credited by
              </span>
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {loanApprovalData.creditedBy}
                </span>
                {user?.role === 'Admin' && (
                  <TbEdit
                    className="text-primaryColor ml-1 cursor-pointer"
                    onClick={() => {
                      setIsUpdateCreditedByOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Approval Date
              </span>
              <span className="text-sm font-medium">
                {format(parseISO(loanApprovalData.approvalDate), 'dd-MM-yyyy')}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Final Remark
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.remark}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Additional Remark
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.additionalRemark}
              </span>
            </div>
            <div className="my-2 flex-col flex">
              <span className="text-xs font-medium text-gray-400 mb-1">
                Loan Purpose
              </span>
              <span className="text-sm font-medium">
                {loanApprovalData.loanPurpose}
              </span>
            </div>
          </div>
        )}
      </Card>
      {/* CREATE APPROVAL MODAL */}
      <ModalContainer
        isOpen={isCreateApprovalOpen}
        onClose={() => setIsCreateApprovalOpen(false)}
        styles="bg-white w-auto">
        {clientData?.loanType === 'payday' ? (
          <CreateApproval leadId={leadId} setIsOpen={setIsCreateApprovalOpen} />
        ) : (
          <CreateEMIApproval
            leadId={leadId}
            setIsOpen={setIsCreateApprovalOpen}
          />
        )}
      </ModalContainer>
      {/* UPDATE APPROVAL MODAL */}
      <ModalContainer
        isOpen={updateIsOpen}
        onClose={() => setUpdateIsOpen(false)}
        styles="bg-white w-auto">
        <UpdateApproval
          leadId={leadId}
          setIsOpen={setUpdateIsOpen}
          editRepayDate={editRepayDate}
        />
      </ModalContainer>
      {/* UPDATE APPROVAL DATE */}
      <ModalContainer
        isOpen={isUpdateCreditedByOpen}
        onClose={() => setIsUpdateCreditedByOpen(false)}
        styles="bg-white w-[60%]">
        <UpdateCreditedBy leadId={leadId} />
      </ModalContainer>
      {/* SHOW SANCTION LETTER MODAL */}
      <ModalContainer
        isOpen={showSL}
        onClose={() => setShowSL(false)}
        styles="bg-white w-[80%] h-auto">
        <SanctionLetter leadId={leadId} />
      </ModalContainer>
      {/* SHOW SEND ALIGNMENT MAIL MODAL */}
      <ModalContainer
        isOpen={isOpenVisitMail}
        onClose={() => setIsOpenVisitMail(false)}
        styles="bg-white w-[50%] h-auto">
        <Controller
          name="pdId"
          control={sendPdMailControl}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="PD Done By"
              value={value}
              onChange={onChange}
              options={
                usersByRoleAndBranchData || [
                  {
                    key: '0',
                    value: 'No PD Team Found',
                    label: 'No PD Team Found',
                  },
                ]
              }
              errorMessage={pdMailErrors.pdId?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pdDate"
          control={sendPdMailControl}
          //defaultValue={parseISO(loanApprovalData?.creditDate || '')}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="PD Vist Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={pdMailErrors.pdDate?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pdTime"
          control={sendPdMailControl}
          render={({ field: { onChange, value } }) => (
            <TimePicker
              selectedTime={value}
              setSelectedTime={onChange}
              label="Visit Time"
              errorMessage={pdMailErrors.pdTime?.message}
            />
          )}
        />
        <Divider />
        <div className="w-full justify-end flex">
          <PrimaryCTA
            ctaText="Send"
            icon="send"
            onClick={pdMailHandleSubmit(sendVisitAlignEmail)}
            viewStyle=""
            loading={loading}
            disabled={!!loading}
          />
        </div>
      </ModalContainer>
    </>
  );
};

export default ApprovalDetails;
