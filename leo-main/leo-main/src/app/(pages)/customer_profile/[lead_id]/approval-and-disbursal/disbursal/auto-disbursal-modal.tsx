import DateSelect from '@/components/date-select';
import InputContainer from '@/components/input-container';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { Title, Divider } from '@tremor/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useClientAutoDisbursalEnabled } from '@/hooks/clients-api';
import { axiosInstance } from '@/network/axiosInstance';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { ManualDisbursalFormType } from './manual-disbursal-modal';
import { useFetchBanks } from '@/hooks/banks-api';
import * as Sentry from '@sentry/react';
import { useCallHistory } from '@/hooks/call-history-api';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import {
  useExisitingLoanDisbursal,
  useLoanDisbursal,
} from '@/hooks/disbursal-api';
import { useFetchLead } from '@/hooks/leads-api';
import { useLoanData } from '@/hooks/loan-api';
import { useLoanApproval } from '@/hooks/approval-api';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';

type AutoDisbursalFormType = ManualDisbursalFormType & {
  paymentProvider: string;
  paymentMode: string;
};

const autoDisbursalValidationSchema = yup.object({
  companyAccountNo: yup.string().required('Company account number required'),
  paymentProvider: yup.string().required('Payment rovider required'),
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
  paymentMode: yup.string().required('Payment mode required'),
});

const AutoDisbursal = ({
  leadId,
  setModalOpen,
}: {
  leadId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // AUTO DISBURSAL
  const [loading, setLoading] = useState(false);
  const [ifscCode, setIFSCCode] = useState('');

  const { loanApprovalData, revalidateLoanApprovalData } = useLoanApproval({
    leadId,
  });
  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role: 'PD_Team',
    branch: loanApprovalData?.branch || '',
  });
  const { clientAutoDisbursalEnabled } = useClientAutoDisbursalEnabled();
  const { bankData, isFetchingBankData } = useFetchBanks({
    ifscCode: ifscCode || '',
  });
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

  const {
    control: autoDisbursalControl,
    watch: autoDisbursalWatch,
    setValue: autoDisbursalSetValue,
    handleSubmit: autoDisbursalSubmit,
    reset: autoDisbursalReset,
    formState: { errors: autoDisbursalErrors },
  } = useForm<AutoDisbursalFormType>({
    resolver: yupResolver(autoDisbursalValidationSchema),
  });

  const watchAutoDisbursalIFSCCode = autoDisbursalWatch('ifscCode');
  const watchAutoDisbursalCompanyAccNo = autoDisbursalWatch('companyAccountNo');

  useEffect(() => {
    if (watchAutoDisbursalIFSCCode) {
      setIFSCCode(watchAutoDisbursalIFSCCode);
    }
  }, [watchAutoDisbursalIFSCCode]);

  useEffect(() => {
    if (bankData) {
      if (watchAutoDisbursalIFSCCode) {
        autoDisbursalSetValue('bankName', bankData.bank);
        autoDisbursalSetValue('bankBranch', bankData.branch);
      }
    }
  }, [autoDisbursalSetValue, bankData, watchAutoDisbursalIFSCCode]);

  useEffect(() => {
    if (watchAutoDisbursalCompanyAccNo) {
      autoDisbursalSetValue(
        'paymentProvider',
        clientAutoDisbursalEnabled?.accounts
          .filter(account => {
            if (account.value === watchAutoDisbursalCompanyAccNo) {
              return account.provider;
            }
          })
          .at(0)?.provider || '',
      );
    }
  }, [
    autoDisbursalSetValue,
    clientAutoDisbursalEnabled?.accounts,
    watchAutoDisbursalCompanyAccNo,
  ]);

  const onAutoSubmit = async (data: AutoDisbursalFormType) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/auto-disbursal/add/${leadId}`, {
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
      setModalOpen(false);
      autoDisbursalReset({
        companyAccountNo: '',
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
        paymentMode: '',
        paymentProvider: '',
      });

      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <>
      <Title className="pb-4">Auto Loan Disbursal</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="companyAccountNo"
          control={autoDisbursalControl}
          defaultValue={clientAutoDisbursalEnabled?.accounts[0].value || ''}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Company Account No"
              value={value}
              onChange={onChange}
              options={clientAutoDisbursalEnabled?.accounts || []}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.accountType?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="accountNo"
          control={autoDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.accountNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Account No."
              placeholder="Enter customer account no."
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.accountNo?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="accountType"
          control={autoDisbursalControl}
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
              errorMessage={autoDisbursalErrors.accountType?.message}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="ifscCode"
          control={autoDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.ifscCode || ''}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="IFSC Code"
              placeholder="Enter IFSC code"
              type="text"
              onChange={onChange}
              pan={true}
              value={value}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.ifscCode?.message}
              disabled={!!loading || isFetchingBankData}
            />
          )}
        />
        <Controller
          name="bankName"
          control={autoDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.bankName}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Name"
              placeholder="Auto Fetch from IFSC"
              type={'text'}
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.bankName?.message}
              disabled={
                !!loading || !watchAutoDisbursalIFSCCode || isFetchingBankData
              }
            />
          )}
        />
        <Controller
          name="bankBranch"
          control={autoDisbursalControl}
          defaultValue={exisitingloanDisbursalData?.bankBranch}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Branch"
              placeholder="Auto Fetch from IFSC"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={autoDisbursalErrors.bankBranch?.message}
              disabled={
                !!loading || !watchAutoDisbursalIFSCCode || isFetchingBankData
              }
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="paymentMode"
          control={autoDisbursalControl}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Payment Mode"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  label: 'IMPS',
                  value: 'imps',
                },
                {
                  key: '2',
                  label: 'NEFT',
                  value: 'neft',
                },
              ]}
              errorMessage={autoDisbursalErrors.paymentMode?.message}
              styles="md:mr-4"
            />
          )}
        />
        <Controller
          name="chequeNo"
          control={autoDisbursalControl}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Cheque / E-Nach No."
              placeholder=""
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.chequeNo?.message}
            />
          )}
        />
        <Controller
          name="disbursalDate"
          control={autoDisbursalControl}
          defaultValue={new Date()}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Disbursal Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              errorMessage={autoDisbursalErrors.disbursalDate?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="pdDoneBy"
          control={autoDisbursalControl}
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
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.pdDoneBy?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pdDoneDate"
          control={autoDisbursalControl}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="PD Done Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={autoDisbursalErrors.pdDoneDate?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="finalRemark"
          control={autoDisbursalControl}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Final Remark"
              placeholder="Remarks.."
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={autoDisbursalErrors.finalRemark?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Disburse"
          onClick={autoDisbursalSubmit(onAutoSubmit)}
          disabled={!!loading}
          loading={!!loading}
        />
      </div>
    </>
  );
};

export default AutoDisbursal;
