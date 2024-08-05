import InputContainer from '@/components/input-container';
import PrimaryCTA from '@/components/primary-cta';
import { Title, Divider } from '@tremor/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Dispatch, SetStateAction, useState } from 'react';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { useLoanDisbursal } from '@/hooks/disbursal-api';
import * as Sentry from '@sentry/react';
import { useCallHistory } from '@/hooks/call-history-api';

type AddUTRFormType = {
  disbursalReferenceNo: string;
};

const addUTRValidationSchema = yup.object({
  disbursalReferenceNo: yup
    .string()
    .required('Disbursal reference number required!'),
});

const AddUTR = ({
  leadId,
  setModalOpen,
  isEdit,
}: {
  leadId: string;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  isEdit?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const { revalidateCustomerData } = useFetchCustomerByLead({
    leadId,
  });
  const { revalidateCallHistory } = useCallHistory({ leadId });
  const { loanDisbursalData, revalidateLoanDisbursalData } = useLoanDisbursal({
    leadId,
  });

  const {
    control: addUTRControl,
    handleSubmit: addUTRHandleSubmit,
    formState: { errors: updateDisbursalErrors },
  } = useForm<AddUTRFormType>({
    resolver: yupResolver(addUTRValidationSchema),
  });

  const onAddUTRSubmit = async (data: AddUTRFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/disbursal/add-utr/${loanDisbursalData?.id}`, {
        ...data,
      });
      revalidateLoanDisbursalData();
      revalidateCallHistory();
      revalidateCustomerData();
      setModalOpen(false);
      toast.success('UTR No. Added!');
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Cannot Update Disbursal! Please try again!');
      setLoading(false);
    }
  };

  return (
    <>
      <Title className="pb-4">{isEdit ? 'Edit' : 'Add'} UTR No.</Title>
      <div className="flex flex-row">
        <Controller
          name="disbursalReferenceNo"
          control={addUTRControl}
          defaultValue={loanDisbursalData?.utrNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="UTR No."
              placeholder="Enter UTR No."
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={updateDisbursalErrors.disbursalReferenceNo?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText={isEdit ? 'Edit' : 'Add'}
          onClick={addUTRHandleSubmit(onAddUTRSubmit)}
          viewStyle=""
          loading={loading}
        />
      </div>
    </>
  );
};

export default AddUTR;
