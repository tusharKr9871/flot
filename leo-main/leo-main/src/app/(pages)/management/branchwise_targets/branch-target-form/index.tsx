import InputSelect from '@/components/input-select';
import { BranchTargetType, useBranchTarget } from '@/hooks/target-api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Divider, Title } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import { BranchCities } from '@/constants/branch';
import NumberInputContainer from '@/components/input-number';
import { Months } from '@/constants/months';
import PrimaryCTA from '@/components/primary-cta';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { generateYears } from '@/utils/utils';
import * as Sentry from '@sentry/react';

type BranchTargetFormType = {
  target: number;
  branchName: string;
  month: string;
  year: string;
};

const validationSchema = yup.object().shape({
  target: yup.number().required('Target is required'),
  branchName: yup.string().required('Branch Name is required'),
  month: yup.string().required('Month is required'),
  year: yup.string().required('Year is required'),
});

const BranchTargetForm = ({
  defaultValue,
  setModalState,
}: {
  defaultValue?: BranchTargetType;
  setModalState: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchTargetFormType>({
    resolver: yupResolver(validationSchema),
  });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pageNumber = (searchParams.get('page') as unknown as number) || 1;
  const { revalidateBranchTargetData } = useBranchTarget({
    pageNumber,
    searchTerm: '',
  });

  const onSubmit = async (data: BranchTargetFormType) => {
    try {
      setLoading(true);
      if (defaultValue) {
        await axiosInstance.put(`/branch-target/update/${defaultValue.id}`, {
          target: data.target,
        });
        toast.success('Target updated successfully!');
      } else {
        await axiosInstance.post('/branch-target/add', {
          ...data,
          month: `${data.month} ${data.year}`,
        });
        toast.success('Target added successfully!');
      }
      reset({
        target: 0,
        branchName: '',
        month: '',
      });
      setModalState(false);
      revalidateBranchTargetData();
      setLoading(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <div className="md:min-w-[512px]">
      <Title className="pb-4">
        {defaultValue ? 'Update Target' : 'Add Target'}
      </Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="branchName"
          control={control}
          defaultValue={defaultValue?.branchName}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Branch"
              value={value}
              onChange={onChange}
              options={BranchCities}
              styles="md:mr-4"
              errorMessage={errors.branchName?.message}
              disabled={!!loading || !!defaultValue}
            />
          )}
        />
        <Controller
          name="target"
          control={control}
          defaultValue={defaultValue?.target}
          render={({ field: { onChange, value } }) => (
            <NumberInputContainer
              label="Target"
              placeholder="Enter Target"
              onChange={onChange}
              value={value}
              errorMessage={errors.target?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="month"
          control={control}
          defaultValue={defaultValue?.month.split(' ')[0]}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Month"
              value={value}
              onChange={onChange}
              options={Months}
              styles="md:mr-4"
              errorMessage={errors.month?.message}
              disabled={!!loading || !!defaultValue}
            />
          )}
        />
        <Controller
          name="year"
          control={control}
          defaultValue={
            defaultValue?.month.split(' ')[1] ||
            new Date().getFullYear().toString()
          }
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Year"
              value={value}
              onChange={onChange}
              options={generateYears()}
              errorMessage={errors.month?.message}
              disabled={!!loading || !!defaultValue}
            />
          )}
        />
      </div>
      <Divider />
      <div className="flex flex-row justify-end pt-4">
        <PrimaryCTA
          ctaText={defaultValue ? 'Update' : 'Add'}
          onClick={handleSubmit(onSubmit)}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BranchTargetForm;
