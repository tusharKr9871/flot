import DateSelect from '@/components/date-select';
import InputContainer from '@/components/input-container';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { useClientBankAccount } from '@/hooks/clients-api';
import { axiosInstance } from '@/network/axiosInstance';
import { Divider, Title } from '@tremor/react';
import { format } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLoanApproval } from '@/hooks/approval-api';
import { useCallHistory } from '@/hooks/call-history-api';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { useFetchLead } from '@/hooks/leads-api';
import { useLoanData } from '@/hooks/loan-api';
import {
  useExisitingLoanDisbursal,
  useLoanDisbursal,
} from '@/hooks/disbursal-api';
import { useFetchBanks } from '@/hooks/banks-api';
import * as Sentry from '@sentry/react';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';

export type ManualDisbursalFormType = {
  companyAccountNo: string;
  accountNo: string;
  accountType: string;
  bankName: string;
  ifscCode: string;
  bankBranch: string;
  chequeNo: string;
  disbursalDate: Date;
  pdDoneBy: string;
  pdDoneDate: Date;
  finalRemark: string;
};

const manualDisbursalValidationSchema = yup.object({
  companyAccountNo: yup.string().required('Company account number required'),
  accountNo: yup.string().required('Account number required'),
  accountType: yup.string().required('Account type required'),
  bankName: yup.string().required('Bank name required'),
  ifscCode: yup.string().required('IFSC required'),
  bankBranch: yup.string().required('Bank branch required'),
  chequeNo: yup.string().required('Cheque number required'),
  disbursalDate: yup.date().required('Disbursal date required'),
  pdDoneBy: yup.string().required('PD done by required'),
  pdDoneDate: yup.date().required('PD date required'),
  finalRemark: yup.string().required('Final remark required'),
});

const ManualDisbursal = ({
  leadId,
  setModalOpen,
}: {
  leadId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [ifscCode, setIFSCCode] = useState('');

  const { loanApprovalData, revalidateLoanApprovalData } = useLoanApproval({
    leadId,
  });
  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role: 'PD_Team',
    branch: loanApprovalData?.branch || '',
  });
  const { clientBankAccounts } = useClientBankAccount();
  const { exisitingloanDisbursalData } = useExisitingLoanDisbursal({
    leadId,
  });
  const { revalidateCallHistory } = useCallHistory({ leadId });
  const { revalidateLead } = useFetchLead({ leadId });
  const { revalidateLoanData } = useLoanData({ leadId });
  const { revalidateCustomerData } = useFetchCustomerByLead({
    leadId,
  });
  const { revalidateLoanDisbursalData } = useLoanDisbursal({
    leadId,
  });
  const { bankData, isFetchingBankData } = useFetchBanks({
    ifscCode: ifscCode || '',
  });

  const {
    control: manualDisbursalControl,
    handleSubmit: manualDisbursalHandleSubmit,
    formState: { errors: manualDisbursalErrors },
    watch,
    setValue,
    reset: manualDisbursalReset,
  } = useForm<ManualDisbursalFormType>({
    resolver: yupResolver(manualDisbursalValidationSchema),
  });
  const watchIFSCCode = watch('ifscCode');

  const onManualSubmit = async (data: ManualDisbursalFormType) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/disbursal/add/${leadId}`, {
        ...data,
        disbursalDate: format(data.disbursalDate, 'dd-MM-yyyy'),
        pdDoneDate: format(data.pdDoneDate, 'dd-MM-yyyy'),
      });
      toast.success('Loan Disbursed!');
      revalidateLoanDisbursalData();
      revalidateCallHistory();
      revalidateLoanApprovalData();
      revalidateLead();
      revalidateCustomerData();
      revalidateLoanData();
      manualDisbursalReset({
        accountNo: '',
        accountType: '',
        bankName: '',
        bankBranch: '',
        chequeNo: '',
        disbursalDate: new Date(),
        ifscCode: '',
        pdDoneBy: '',
        pdDoneDate: new Date(),
        finalRemark: '',
        companyAccountNo: '',
      });
      setModalOpen(false);
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Cannot Disburse Loan! Please try again!');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (watchIFSCCode) {
      setIFSCCode(watchIFSCCode);
    }
  }, [setValue, watchIFSCCode]);

  useEffect(() => {
    if (bankData) {
      if (watchIFSCCode) {
        setValue('bankName', bankData.bank);
        setValue('bankBranch', bankData.branch);
      }
    }
  }, [bankData, setValue, watchIFSCCode]);

  return (
    <>
      <Title className="pb-4">Manual Loan Disbursal</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="companyAccountNo"
          control={manualDisbursalControl}
          defaultValue={clientBankAccounts?.clientBankAccounts[0].value || ''}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Account No"
              value={value}
              onChange={onChange}
              options={clientBankAccounts?.clientBankAccounts || []}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.accountType?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="accountNo"
          control={manualDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.accountNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Account No."
              placeholder="Enter customer account no."
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.accountNo?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="accountType"
          control={manualDisbursalControl}
          defaultValue={'Savings'}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Account Type"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Savings',
                  label: 'Savings',
                },
                {
                  key: '2',
                  value: 'Current',
                  label: 'Current',
                },
              ]}
              errorMessage={manualDisbursalErrors.accountType?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="ifscCode"
          control={manualDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.ifscCode || ''}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="IFSC Code"
              placeholder="Enter IFSC code"
              type="text"
              onChange={onChange}
              value={value}
              pan={true}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.ifscCode?.message}
              disabled={!!loading || isFetchingBankData}
            />
          )}
        />
        <Controller
          name="bankName"
          control={manualDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.bankName}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Name"
              placeholder="Auto Fetch from IFSC"
              type={'text'}
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.bankName?.message}
              disabled={!!loading || !watchIFSCCode || isFetchingBankData}
            />
          )}
        />
        <Controller
          name="bankBranch"
          control={manualDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.bankBranch}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Branch"
              placeholder="Auto Fetch from IFSC"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={manualDisbursalErrors.bankBranch?.message}
              disabled={!!loading || !watchIFSCCode || isFetchingBankData}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="chequeNo"
          control={manualDisbursalControl}
          defaultValue="0"
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Cheque No."
              placeholder="Enter cheque no."
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.chequeNo?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="disbursalDate"
          control={manualDisbursalControl}
          defaultValue={new Date()}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Disbursal Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={manualDisbursalErrors.disbursalDate?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pdDoneBy"
          control={manualDisbursalControl}
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
              errorMessage={manualDisbursalErrors.pdDoneBy?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="pdDoneDate"
          control={manualDisbursalControl}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="PD Done Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4 basis-1/3"
              errorMessage={manualDisbursalErrors.pdDoneDate?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="finalRemark"
          control={manualDisbursalControl}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Final Remark"
              placeholder="Remarks.."
              type="text"
              onChange={onChange}
              value={value}
              styles="basis-2/3"
              errorMessage={manualDisbursalErrors.finalRemark?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Disburse"
          onClick={manualDisbursalHandleSubmit(onManualSubmit)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </>
  );
};

export default ManualDisbursal;
