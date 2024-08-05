'use client';

import { Title } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import { LoanRequirementBrackets } from '@/constants/loan-requirement-brackets';
import { BranchStates } from '@/constants/branch';
import { getCityByState } from '@/utils/utils';
import InputContainer from '@/components/input-container';
import InputSelect, { Option } from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { LoanPurpose } from '@/constants/loan-purpose';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/network/axiosInstance';
import { useFetchReassignUsersByRoleAndBranch } from '@/hooks/user-api';

type CreateLeadFormType = {
  purpose: string;
  loanAmountRequired: string;
  monthlyIncome: string;
  city: string;
  state: string;
  pincode: string;
  user: string;
};

const validationSchema = yup.object({
  purpose: yup.string().required('Purpose is required'),
  loanAmountRequired: yup.string().required('Loan Required is required'),
  monthlyIncome: yup.string().required('Monthly Income is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('Pincode is required'),
  user: yup.string().required('User assignee is required'),
});

const ReloanForm = ({ phoneNo }: { phoneNo: string }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateLeadFormType>({
    resolver: yupResolver(validationSchema),
  });
  const watchState = watch('state');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [callingTeam, setCallingTeam] = useState<Option[]>([]);
  const { usersByRoleAndBranchData: teleCallers } =
    useFetchReassignUsersByRoleAndBranch({
      role: 'Tele_Caller',
      branch: 'Delhi',
    });
  const { usersByRoleAndBranchData: loanOfficers } =
    useFetchReassignUsersByRoleAndBranch({
      role: 'Loan_Officer',
      branch: 'Delhi',
    });
  useEffect(() => {
    if (teleCallers && loanOfficers) {
      const filteredTeleCallers = teleCallers.filter(
        officer => officer.label !== 'None',
      );
      const callingTeam = filteredTeleCallers.concat(loanOfficers);
      setCallingTeam(callingTeam);
    }
  }, [loanOfficers, teleCallers]);
  const onSubmit = async (data: CreateLeadFormType) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/leads/reapply', {
        ...data,
        phoneNo,
        user: data.user ? data.user : null,
        clientId: window.localStorage.getItem('clientId'),
      });
      setLoading(false);
      reset({
        purpose: '',
        loanAmountRequired: '',
        monthlyIncome: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success('Reapplied successfully!');
      router.push(`/customer_profile/${response.data.leadId}`);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Title className="pb-4">Reloan Customer</Title>
      <div className="md:flex md:flex-1 flex-row justify-between">
        <Controller
          name="purpose"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Purpose"
              value={value}
              onChange={onChange}
              options={LoanPurpose}
              styles="md:mr-4 md:w-1/3"
              errorMessage={errors.purpose?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="loanAmountRequired"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Loan required"
              value={value}
              onChange={onChange}
              options={LoanRequirementBrackets}
              styles="md:mr-4 md:w-1/3"
              errorMessage={errors.loanAmountRequired?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="monthlyIncome"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Monthly Income"
              value={value}
              styles="md:w-1/3"
              onChange={onChange}
              options={LoanRequirementBrackets}
              errorMessage={errors.monthlyIncome?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="state"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="State"
              value={value}
              onChange={onChange}
              options={BranchStates}
              styles="md:mr-4"
              errorMessage={errors.state?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="City"
              value={value}
              onChange={onChange}
              //@ts-ignore
              options={getCityByState(watchState)}
              styles="md:mr-4"
              errorMessage={errors.city?.message}
              disabled={!!loading || !watchState}
            />
          )}
        />
        <Controller
          name="pincode"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Pincode"
              placeholder="Enter pincode"
              type="text"
              maxLength={6}
              onChange={onChange}
              value={value}
              errorMessage={errors.city?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="user"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Assignee"
              value={value}
              onChange={onChange}
              options={callingTeam}
              disabled={!!loading}
              errorMessage={errors.user?.message}
              styles="md:mr-4 md:w-1/3"
            />
          )}
        />
      </div>
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText="Submit"
          onClick={handleSubmit(onSubmit)}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReloanForm;
