import InputSelect, { Option } from '@/components/input-select';
import { SanctionTargetType, useSanctionTarget } from '@/hooks/target-api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Divider, Title } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import NumberInputContainer from '@/components/input-number';
import { Months } from '@/constants/months';
import PrimaryCTA from '@/components/primary-cta';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import { useSearchParams } from 'next/navigation';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import { generateYears } from '@/utils/utils';
import * as Sentry from '@sentry/react';

type SanctionTargetFormType = {
  target: number;
  sanctionUserId: string;
  month: string;
  year: string;
};

const validationSchema = yup.object().shape({
  target: yup.number().required('Target is required'),
  sanctionUserId: yup.string().required('Branch Name is required'),
  month: yup.string().required('Month is required'),
  year: yup.string().required('Year is required'),
});

const SanctionTargetForm = ({
  defaultValue,
  setModalState,
}: {
  defaultValue?: SanctionTargetType;
  setModalState: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SanctionTargetFormType>({
    resolver: yupResolver(validationSchema),
  });
  const [loading, setLoading] = useState(false);
  const [sanctionOfficers, setSanctionOfficers] = useState<Option[]>([]);
  const searchParams = useSearchParams();
  const pageNumber = (searchParams.get('page') as unknown as number) || 1;
  const { revalidatesanctionTargetData } = useSanctionTarget({
    pageNumber,
    searchTerm: '',
  });
  const { usersByRoleAndBranchData: creditManagers } =
    useFetchUsersByRoleAndBranch({
      role: 'Credit_Manager',
      branch: '',
    });
  const { usersByRoleAndBranchData: loanOfficers } =
    useFetchUsersByRoleAndBranch({
      role: 'Loan_Officer',
      branch: '',
    });

  useEffect(() => {
    if (creditManagers && loanOfficers) {
      let sanctionOfficers = creditManagers.concat(loanOfficers);
      sanctionOfficers = sanctionOfficers.filter(
        officer => officer.label !== 'None',
      );
      setSanctionOfficers(sanctionOfficers);
    }
  }, [creditManagers, loanOfficers]);

  const onSubmit = async (data: SanctionTargetFormType) => {
    try {
      setLoading(true);
      if (data.sanctionUserId === 'None') {
        throw new Error('Sanction Officer is required');
      }
      if (defaultValue) {
        await axiosInstance.put(`/sanction-target/update/${defaultValue.id}`, {
          target: data.target,
          sanctionUserId: data.sanctionUserId,
        });
        toast.success('Target updated successfully!');
      } else {
        await axiosInstance.post('/sanction-target/add', {
          ...data,
          month: `${data.month} ${data.year}`,
        });
        toast.success('Target added successfully!');
      }
      reset({
        target: 0,
        sanctionUserId: '',
        month: '',
      });
      setModalState(false);
      revalidatesanctionTargetData();
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
          name="sanctionUserId"
          control={control}
          defaultValue={defaultValue?.sanctionedTo.id}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Sanction Officer"
              value={value}
              onChange={onChange}
              options={sanctionOfficers}
              styles="md:mr-4"
              errorMessage={errors.sanctionUserId?.message}
              disabled={!!loading}
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
          defaultValue={defaultValue?.month.split(' ')[1]}
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

export default SanctionTargetForm;
