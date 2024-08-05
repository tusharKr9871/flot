import InputContainer from '@/components/input-container';
import NumberInputContainer from '@/components/input-number';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { BranchCities } from '@/constants/branch';
import { LoanPurpose } from '@/constants/loan-purpose';
import { formatIndianNumber } from '@/utils/utils';
import { Title, Divider } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import {
  useExistingLoanApproval,
  useLoanApproval,
  EMILoanApprovalFormType,
} from '@/hooks/approval-api';
import { useCreditReportApi } from '@/hooks/credit-report-api';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/network/axiosInstance';
import { addMonths, format } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { useCallHistory } from '@/hooks/call-history-api';
import { useFetchLead } from '@/hooks/leads-api';
import * as yup from 'yup';
import * as Sentry from '@sentry/react';
import Loader from '@/components/loader';

const createApprovalValidationSchema = yup.object().shape({
  // loanType: yup.string().required('Loan type is required!'),
  branch: yup.string().required('Branch is required'),
  approvalAmount: yup
    .number()
    .typeError('Approval Amount must be a number')
    .required('Approved Loan Amount is required'),
  roi: yup
    .number()
    .typeError('ROI must be a number')
    .required('ROI is required'),
  processingFeePercent: yup
    .number()
    .typeError('Processing Fee Percent must be a number')
    .max(99, 'Percentage cannot be greater than 100')
    .required('Processing Fee Percent is required'),
  processingFee: yup
    .number()
    .typeError('Processing fee must be a number')
    .required('Admin Fee is required'),
  conversionFeesPercent: yup
    .number()
    .typeError('Conversion Fee Percent must be a number')
    .max(99, 'Conversion cannot be greater than 100')
    .required('Conversion Fee Percent is required'),
  conversionFees: yup
    .number()
    .typeError('Processing fee must be a number')
    .required('Admin Fee is required'),
  gst: yup
    .number()
    .typeError('GST % must be a number')
    .required('GST is required'),
  alternateNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Invalid Phone no.!')
    .required('Alterante phone number required'),
  email: yup.string().email().required('Company Email is required'),
  cibilScore: yup
    .number()
    .typeError('Cibil must be a number')
    .required('Cibil Score is required'),
  monthlyIncome: yup
    .number()
    .typeError('Monthly Income must be a number')
    .required('Monthly Income is required'),
  status: yup.string().required('Status is required'),
  remark: yup.string().required('Remark is required'),
  loanPurpose: yup.string().required('Loan Purpose is required'),
  rejectionReason: yup.string(),
});

const CreateEMIApproval = ({
  leadId,
  setIsOpen,
}: {
  leadId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);

  const { existingLoanApprovalData, isFetchingExisitingLoanApprovalData } =
    useExistingLoanApproval({ leadId });

  const { creditReportData, isFetchingCreditReportData } = useCreditReportApi({
    leadId,
  });

  const { revalidateCustomerData } = useFetchCustomerByLead({ leadId });
  const { revalidateCallHistory } = useCallHistory({
    leadId,
  });
  const { revalidateLoanApprovalData } = useLoanApproval({ leadId });
  const { leadData, revalidateLead } = useFetchLead({ leadId });

  // * Create
  const {
    control: createCreditReportControl,
    formState: { errors },
    handleSubmit: handleCreateSubmit,
    watch: watchCreate,
    setValue: setCreateValue,
  } = useForm<EMILoanApprovalFormType>({
    resolver: yupResolver(createApprovalValidationSchema),
    mode: 'onChange',
  });
  const watchApprovalAmount = watchCreate('approvalAmount');
  const watchProcessingFeePercent = watchCreate('processingFeePercent');
  const watchConversionFeesPercent = watchCreate('conversionFeesPercent');

  useEffect(() => {
    setCreateValue(
      'processingFee',
      watchApprovalAmount * watchProcessingFeePercent * 0.01,
    );
    setCreateValue(
      'conversionFees',
      watchApprovalAmount * watchConversionFeesPercent * 0.01,
    );
  }, [
    setCreateValue,
    watchApprovalAmount,
    watchConversionFeesPercent,
    watchProcessingFeePercent,
  ]);

  const onCreate = async (data: EMILoanApprovalFormType) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/approval/add/${leadId}`, {
        ...data,
        salaryDate: format(new Date(), 'dd-MM-yyyy'),
        repayDate: format(addMonths(new Date(), 1), 'dd-MM-yyyy'),
      });
      toast.success('Loan approval created successfully!');
      revalidateLoanApprovalData();
      revalidateCallHistory();
      revalidateCustomerData();
      revalidateLead();
      setIsOpen(false);
      setLoading(false);
    } catch (e) {
      toast.error('Cannot create loan approval!');
      Sentry.captureException(e);
      setLoading(false);
    }
  };

  if (isFetchingExisitingLoanApprovalData || isFetchingCreditReportData) {
    return <Loader />;
  }

  return (
    <>
      <Title className="mb-2">Add EMI Loan</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="branch"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.branch}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Branch"
              value={value}
              onChange={onChange}
              options={BranchCities}
              styles="md:mr-4"
              errorMessage={errors.branch?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="approvalAmount"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.approvalAmount}
          rules={{
            max: {
              value: creditReportData ? creditReportData.eligibleAmount : 0,
              message:
                'Approval amount cannot be greater than eligible amount!',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-col w-full md:mr-4">
              <NumberInputContainer
                label="Approved Loan Amount"
                placeholder="Enter approved loan amount"
                onChange={onChange}
                value={value}
                errorMessage={errors.approvalAmount?.message}
                disabled={!!loading}
              />
              {creditReportData?.eligibleAmount &&
                watchApprovalAmount > creditReportData.eligibleAmount && (
                  <p className="text-yellow-500 text-sm mb-1">
                    Recommended to keep approval amount less than or equal to{' '}
                    {formatIndianNumber(creditReportData.eligibleAmount)}
                  </p>
                )}
            </div>
          )}
        />
        <Controller
          name="roi"
          control={createCreditReportControl}
          defaultValue={
            existingLoanApprovalData ? existingLoanApprovalData.roi : 2.99
          }
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Rate of Interest"
              placeholder="Enter ROI"
              onChange={onChange}
              value={value}
              errorMessage={errors.roi?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="monthlyIncome"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.monthlyIncome}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Monthly Income"
              placeholder="Enter monthly income"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.monthlyIncome?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="processingFeePercent"
          control={createCreditReportControl}
          defaultValue={5}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Processing Fee %"
              placeholder="Enter processing fee %"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.processingFeePercent?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="processingFee"
          control={createCreditReportControl}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Processing Fee"
              placeholder="Enter processing fees"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.processingFee?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="conversionFeesPercent"
          control={createCreditReportControl}
          defaultValue={5}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Processing Fee %"
              placeholder="Enter processing fee %"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.processingFeePercent?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="conversionFees"
          control={createCreditReportControl}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Conversion Fee"
              placeholder="Enter processing fees"
              onChange={onChange}
              value={value}
              errorMessage={errors.processingFee?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="gst"
          control={createCreditReportControl}
          defaultValue={18.0}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="GST%"
              placeholder="Enter GST %"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.gst?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="cibilScore"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.cibilScore}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Cibil Score"
              placeholder="Enter CIBIl Score"
              onChange={onChange}
              value={value}
              max={999}
              errorMessage={errors.cibilScore?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="email"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.email}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Company Email"
              placeholder="Enter company email"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.email?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="alternateNumber"
          control={createCreditReportControl}
          defaultValue={existingLoanApprovalData?.alternateNumber}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Alternate Phone No"
              placeholder="Enter alternate phone no."
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.alternateNumber?.message}
              maxLength={10}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="loanPurpose"
          control={createCreditReportControl}
          defaultValue={leadData?.purpose}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Loan Requirement Reason"
              value={value}
              onChange={onChange}
              options={LoanPurpose}
              errorMessage={errors.loanPurpose?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-start">
        <Controller
          name="status"
          control={createCreditReportControl}
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
              styles="md:mr-4"
              errorMessage={errors.status?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="remark"
          control={createCreditReportControl}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Final Remark"
              placeholder="Enter Final Remark"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.remark?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Submit"
          onClick={handleCreateSubmit(onCreate)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </>
  );
};

export default CreateEMIApproval;
