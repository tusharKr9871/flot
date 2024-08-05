import { LeadStatusUpdateOptions } from '@/constants/lead-status';
import { Card, Title } from '@tremor/react';
import InputContainer from '../input-container';
import InputSelect from '../input-select';
import PrimaryCTA from '../primary-cta';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { useFetchLead, useFetchLeads } from '@/hooks/leads-api';
import { Dispatch, SetStateAction, useState } from 'react';
import { useCallHistory } from '@/hooks/call-history-api';
import * as Sentry from '@sentry/react';

type CustomerStatusUpdateFormType = {
  status: string;
  remark: string;
};

const validationSchema = yup.object({
  status: yup.string().required('Status required'),
  remark: yup.string().required('Remark Required'),
});

const CallingStatusCard = ({
  leadId,
  pageNumber = 1,
  setViewModalOpen,
}: {
  leadId: string;
  pageNumber?: number;
  setViewModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerStatusUpdateFormType>({
    resolver: yupResolver(validationSchema),
  });
  const { customerData, revalidateCustomerData } = useFetchCustomerByLead({
    leadId,
  });
  const { revalidateLeads } = useFetchLeads({
    pageNumber,
  });
  const { revalidateLead } = useFetchLead({ leadId });
  const { revalidateCallHistory } = useCallHistory({ leadId });

  const onSubmit = async (data: CustomerStatusUpdateFormType) => {
    try {
      setLoading(true);
      const callHistoryData = {
        ...data,
        callType: 'changed status to',
      };
      await axiosInstance.post(
        `/call-history/create/${leadId}`,
        callHistoryData,
      );
      toast.success('Call history added successfully!');
      reset({
        status: '',
        remark: '',
      });
      revalidateCustomerData();
      revalidateLeads();
      revalidateLead();
      revalidateCallHistory();
      setViewModalOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot update, something went wrong!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  return (
    <Card className="mt-2 md:mt-0 shadow-md">
      <Title>Calling Status</Title>
      <div className="flex flex-col mt-4">
        <Controller
          name="status"
          control={control}
          defaultValue={customerData?.status}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Set Status"
              value={value}
              onChange={onChange}
              options={LeadStatusUpdateOptions}
              errorMessage={errors.status?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="remark"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Remark"
              placeholder="Enter remarks"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={errors.remark?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="w-full flex justify-end">
        <PrimaryCTA
          ctaText="Submit"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </Card>
  );
};

export default CallingStatusCard;
