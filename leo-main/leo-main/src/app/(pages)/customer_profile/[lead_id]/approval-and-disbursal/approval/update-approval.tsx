import DateSelect from '@/components/date-select';
import InputContainer from '@/components/input-container';
import NumberInputContainer from '@/components/input-number';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { BranchCities } from '@/constants/branch';
import { Divider, Title } from '@tremor/react';
import { format, parse, parseISO } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { axiosInstance } from '@/network/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLoanApproval } from '@/hooks/approval-api';
import { useCallHistory } from '@/hooks/call-history-api';
import { useFetchLead } from '@/hooks/leads-api';
import * as yup from 'yup';
import * as Sentry from '@sentry/react';
import Loader from '@/components/loader';

type ApprovalUpdateFormType = {
  branch: string;
  approvalAmount: number;
  roi: number;
  salaryDate: Date;
  repayDate: Date;
  officialEmail: string;
  processingFeePercent: number;
  processingFee: number;
  status: string;
  remark?: string;
  creditedAt: Date;
};

const updateApprovalValidationSchema = yup.object().shape({
  branch: yup.string().required('Branch is required'),
  approvalAmount: yup
    .number()
    .typeError('Approval amount must be a number')
    .required('Approved Loan Amount is required'),
  roi: yup
    .number()
    .typeError('ROI must be a number')
    .required('ROI is required'),
  salaryDate: yup.date().required('Salary Date is required'),
  repayDate: yup.date().required('Loan Repayment Date is required'),
  officialEmail: yup.string().required('Official Email is required'),
  processingFeePercent: yup
    .number()
    .typeError('Processing Fee Percent must be a number')
    .max(99, 'Percentage cannot be greater than 100')
    .required('Processing Fee Percent is required'),
  processingFee: yup
    .number()
    .typeError('Processing Fee must be a number')
    .required('Admin Fee is required'),
  status: yup.string().required('Status is required'),
  remark: yup.string(),
  creditedAt: yup.date().required('credited At Date is required'),
});

const UpdateApproval = ({
  leadId,
  setIsOpen,
  editRepayDate,
}: {
  leadId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  editRepayDate: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const {
    loanApprovalData,
    isFetchingLoanApprovalData,
    revalidateLoanApprovalData,
  } = useLoanApproval({
    leadId,
  });
  const { revalidateCallHistory } = useCallHistory({
    leadId,
  });
  const { revalidateLead } = useFetchLead({ leadId });

  // * Update
  const {
    control: updateCreditReportControl,
    formState: { errors: updateErrors },
    handleSubmit: handleUpdateSubmit,
    watch: watchUpdate,
    setValue: setUpdateValue,
  } = useForm<ApprovalUpdateFormType>({
    resolver: yupResolver(updateApprovalValidationSchema),
  });
  const watchUpdatedApprovalAmount = watchUpdate('approvalAmount');
  const watchProcessingFeePercent = watchUpdate('processingFeePercent');

  const onUpdateSubmit = async (data: ApprovalUpdateFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/approval/update/${leadId}`, {
        ...data,
        salaryDate: format(data.salaryDate, 'dd-MM-yyyy'),
        repayDate: format(data.repayDate, 'dd-MM-yyyy'),
        editRepayDate,
      });
      toast.success('Loan approval updated!');
      revalidateLoanApprovalData();
      revalidateCallHistory();
      revalidateLead();
      setIsOpen(false);
      setLoading(false);
    } catch (e) {
      Sentry.captureException(e);
      toast.error('Cannot update approval!');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loanApprovalData) {
      setUpdateValue('approvalAmount', loanApprovalData.approvalAmount);
    }
  }, [loanApprovalData, setUpdateValue]);

  useEffect(() => {
    if (loanApprovalData) {
      setUpdateValue(
        'processingFee',
        watchUpdatedApprovalAmount * watchProcessingFeePercent * 0.01,
      );
    }
  }, [
    loanApprovalData,
    setUpdateValue,
    watchUpdatedApprovalAmount,
    watchProcessingFeePercent,
  ]);

  if (isFetchingLoanApprovalData) {
    return <Loader />;
  }

  return (
    <>
      <Title className="pb-4">Update Payday Loan</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="branch"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.branch}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Branch"
              value={value}
              onChange={onChange}
              options={BranchCities}
              styles="md:mr-4"
              errorMessage={updateErrors.branch?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
        <Controller
          name="approvalAmount"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.approvalAmount}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Approved Loan Amount"
              placeholder="Enter approved amount"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={updateErrors.approvalAmount?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
        <Controller
          name="roi"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.roi}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Rate of Interest"
              placeholder="Enter ROI"
              onChange={onChange}
              value={value}
              errorMessage={updateErrors.roi?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="salaryDate"
          control={updateCreditReportControl}
          defaultValue={parse(
            loanApprovalData?.salaryDate || '',
            'dd-MM-yyyy',
            new Date(),
          )}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Salary Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={updateErrors.repayDate?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
        <Controller
          name="repayDate"
          control={updateCreditReportControl}
          defaultValue={parseISO(loanApprovalData?.repayDate || '')}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Repayment Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={updateErrors.repayDate?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="officialEmail"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.email}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Company Email"
              placeholder="Enter company email"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={updateErrors.officialEmail?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="processingFeePercent"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.processingFeePercent}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Processing Fee %"
              placeholder="Enter processing fee %"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={updateErrors.processingFeePercent?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="processingFee"
          control={updateCreditReportControl}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Processing Fee"
              placeholder="Enter processing fee"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={updateErrors.processingFee?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
        <Controller
          name="status"
          control={updateCreditReportControl}
          defaultValue={loanApprovalData?.status}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Status"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Approved',
                  label: 'Approved',
                },
                {
                  key: '2',
                  value: 'Rejected',
                  label: 'Rejected',
                },
              ]}
              errorMessage={updateErrors.status?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="creditedAt"
          control={updateCreditReportControl}
          defaultValue={parseISO(loanApprovalData?.approvalDate || '')}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Approved At"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={updateErrors.creditedAt?.message}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
        <Controller
          name="remark"
          control={updateCreditReportControl}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Remark (Optional)"
              placeholder=""
              type="text"
              onChange={onChange}
              value={value}
              disabled={!!loading || editRepayDate}
            />
          )}
        />
      </div>

      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Update"
          onClick={handleUpdateSubmit(onUpdateSubmit)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </>
  );
};

export default UpdateApproval;
