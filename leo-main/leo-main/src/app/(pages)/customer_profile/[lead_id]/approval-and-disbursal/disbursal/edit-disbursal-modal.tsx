import DateSelect from '@/components/date-select';
import InputContainer from '@/components/input-container';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { Title, Divider } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoanDisbursal } from '@/hooks/disbursal-api';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFetchBanks } from '@/hooks/banks-api';
import { axiosInstance } from '@/network/axiosInstance';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '@/components/loader';
import * as Sentry from '@sentry/react';

type EditDisbursalFormType = {
  accountNo: string;
  accountType: string;
  bankName: string;
  ifscCode: string;
  bankBranch: string;
  disbursalDate: Date;
};

const editDisbursalValidationSchema = yup.object({
  accountNo: yup.string().required('Account number required'),
  accountType: yup.string().required('Account type required'),
  bankName: yup.string().required('Bank name required'),
  ifscCode: yup.string().required('IFSC required'),
  bankBranch: yup.string().required('Bank branch required'),
  disbursalDate: yup.date().required('Disbursal date required'),
});

const EditDisbursal = ({
  leadId,
  setModalOpen,
  editDisbursalDate,
}: {
  leadId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  editDisbursalDate: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [ifscCode, setIFSCCode] = useState('');

  const {
    control: editDisbursalControl,
    handleSubmit: editDisbursalHandleSubmit,
    formState: { errors: editDisbursalErrors },
    watch,
    setValue,
  } = useForm<EditDisbursalFormType>({
    resolver: yupResolver(editDisbursalValidationSchema),
  });
  const watchIFSCCode = watch('ifscCode');

  const { bankData, isFetchingBankData } = useFetchBanks({
    ifscCode: ifscCode || '',
  });
  const {
    loanDisbursalData,
    isFetchingLoanDisbursalData,
    revalidateLoanDisbursalData,
  } = useLoanDisbursal({
    leadId,
  });

  useEffect(() => {
    if (watchIFSCCode) {
      setIFSCCode(watchIFSCCode);
    }
  }, [watchIFSCCode]);

  useEffect(() => {
    if (bankData) {
      if (watchIFSCCode) {
        setValue('bankName', bankData.bank);
        setValue('bankBranch', bankData.branch);
      }
    }
  }, [bankData, setValue, watchIFSCCode]);

  const onSubmit = async (data: EditDisbursalFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put(
        `/disbursal/edit-disbursal/${loanDisbursalData?.id}`,
        {
          ...data,
          disbursalDate: format(data.disbursalDate, 'dd-MM-yyyy'),
        },
      );
      revalidateLoanDisbursalData();
      setModalOpen(false);
      toast.success('Disbursal Details Edited!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Sentry.captureException(error);
      toast.error('Something went wrong!');
    }
  };

  if (isFetchingLoanDisbursalData) {
    return <Loader />;
  }

  return (
    <>
      <Title className="pb-4">Edit Disbursal</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="accountNo"
          control={editDisbursalControl}
          defaultValue={loanDisbursalData?.accountNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Account No."
              placeholder="Enter customer account no."
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={editDisbursalErrors.accountNo?.message}
              disabled={!!loading || editDisbursalDate}
            />
          )}
        />
        <Controller
          name="accountType"
          control={editDisbursalControl}
          defaultValue={loanDisbursalData?.accountType || 'Savings'}
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
              errorMessage={editDisbursalErrors.accountType?.message}
              disabled={!!loading || editDisbursalDate}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="ifscCode"
          control={editDisbursalControl}
          defaultValue={loanDisbursalData?.ifscCode || ''}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="IFSC Code"
              placeholder="Enter IFSC code"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={editDisbursalErrors.ifscCode?.message}
              disabled={!!loading || isFetchingBankData || editDisbursalDate}
            />
          )}
        />
        <Controller
          name="bankName"
          control={editDisbursalControl}
          defaultValue={loanDisbursalData?.bankName}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Name"
              placeholder="Auto Fetch from IFSC"
              type={'text'}
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={editDisbursalErrors.bankName?.message}
              disabled={
                !!loading ||
                !watchIFSCCode ||
                isFetchingBankData ||
                editDisbursalDate
              }
            />
          )}
        />
        <Controller
          name="bankBranch"
          control={editDisbursalControl}
          defaultValue={loanDisbursalData?.bankBranch}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Bank Branch"
              placeholder="Auto Fetch from IFSC"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={editDisbursalErrors.bankBranch?.message}
              disabled={
                !!loading ||
                !watchIFSCCode ||
                isFetchingBankData ||
                editDisbursalDate
              }
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="disbursalDate"
          control={editDisbursalControl}
          defaultValue={new Date()}
          render={({ field: { onChange, value } }) => (
            <DateSelect
              label="Disbursal Date"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              styles="md:mr-4"
              errorMessage={editDisbursalErrors.disbursalDate?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Confirm"
          onClick={editDisbursalHandleSubmit(onSubmit)}
          viewStyle=""
          loading={loading}
          disabled={!!loading}
        />
      </div>
    </>
  );
};

export default EditDisbursal;
