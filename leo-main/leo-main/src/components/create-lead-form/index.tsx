'use client';

import { Title } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import InputSelect, { Option } from '../input-select';
import InputContainer from '../input-container';
import PrimaryCTA from '../primary-cta';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import axios from 'axios';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import DateInput from '../date-input';
import { parseISO } from 'date-fns';
import { LoanRequirementBrackets } from '@/constants/loan-requirement-brackets';
import { BranchStates } from '@/constants/branch';
import { getCityByState } from '@/utils/utils';
import { LoanPurpose } from '@/constants/loan-purpose';
import { useAuth } from '@/context/AuthContextProvider';

type CreateLeadFormType = {
  name: string;
  gender: string;
  dob: string;
  phoneNo: string;
  email: string;
  pan: string;
  aadhaar: string;
  marital_status: string;
  user: string;
  purpose: string;
  loanAmountRequired: string;
  monthlyIncome: string;
  city: string;
  state: string;
  pincode: string;
};

const validationSchema = yup.object({
  name: yup.string().required('Name required'),
  gender: yup.string().required('Gender is required'),
  dob: yup.string().required('DOB is required'),
  phoneNo: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number required'),
  email: yup.string().required('Email required'),
  pan: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN card number')
    .required('PAN is required'),
  aadhaar: yup.string().required('Aadhar Number is required'),
  marital_status: yup.string().required('Marital Status is required'),
  user: yup.string().required('Assignee is required'),
  purpose: yup.string().required('Purpose is required'),
  loanAmountRequired: yup.string().required('Loan Required is required'),
  monthlyIncome: yup.string().required('Monthly Income is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('Pincode is required'),
});

const CreateLeadForm = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateLeadFormType>({
    resolver: yupResolver(validationSchema),
  });
  const { user } = useAuth();

  const watchState = watch('state');
  const watchAssignee = watch('user');
  const [loading, setLoading] = useState(false);
  const [callingTeam, setCallingTeam] = useState<Option[]>([]);

  const { usersByRoleAndBranchData: teleCallers } =
    useFetchUsersByRoleAndBranch({
      role: 'Tele_Caller',
      branch: 'Delhi',
    });

  const { usersByRoleAndBranchData: loanOfficers } =
    useFetchUsersByRoleAndBranch({
      role: 'Loan_Officer',
      branch: 'Delhi',
    });

  useEffect(() => {
    if (user?.role === 'Tele_Caller' || user?.role === 'Loan_Officer') {
      setCallingTeam([
        {
          key: '1',
          value: user.id,
          label: user.name,
        },
      ]);
    } else if (teleCallers && loanOfficers) {
      const filteredTeleCallers = teleCallers.filter(
        officer => officer.label !== 'None',
      );
      const callingTeam = filteredTeleCallers.concat(loanOfficers);
      setCallingTeam(callingTeam);
    }
  }, [loanOfficers, teleCallers, user]);

  useEffect(() => {
    if (watchAssignee === 'None') {
      setError('user', { type: 'custom', message: 'No Assignee Selected!' });
    }
  }, [setError, watchAssignee]);

  const onSubmit = async (data: CreateLeadFormType) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_CUSTOMER_API_BASE_URL}/customer/create-lead`,
        {
          ...data,
          dob: parseISO(data.dob),
          ip: 'N/A',
          domain_name: 'Paisaintime',
          user: data.user ? data.user : null,
          clientId: window.localStorage.getItem('clientId'),
        },
      );
      setLoading(false);
      reset({
        name: '',
        gender: '',
        dob: '',
        phoneNo: '',
        email: '',
        pan: '',
        aadhaar: '',
        marital_status: '',
        purpose: '',
        loanAmountRequired: '',
        monthlyIncome: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success('Lead created successfully!');
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Title className="pb-4">Create Lead</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Full Name"
              placeholder="Enter full name"
              type="text"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.name?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Gender"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Male',
                  label: 'Male',
                },
                {
                  key: '2',
                  value: 'Female',
                  label: 'Female',
                },
              ]}
              styles="md:mr-4"
              errorMessage={errors.gender?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="dob"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateInput
              label="Date of Birth"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              errorMessage={errors.dob?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="phoneNo"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Phone Number"
              placeholder="Enter phone number"
              type="text"
              onChange={onChange}
              maxLength={10}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.phoneNo?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Email"
              placeholder="Enter email"
              type="email"
              onChange={onChange}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.email?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="pan"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Pancard"
              placeholder="Enter pancard number"
              type="text"
              onChange={onChange}
              maxLength={10}
              value={value}
              errorMessage={errors.pan?.message}
              disabled={!!loading}
              pan={true}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="aadhaar"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Aadhar Number"
              placeholder="Enter aadhar number"
              type="text"
              onChange={onChange}
              maxLength={12}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.aadhaar?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="marital_status"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Marital Status"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Married',
                  label: 'Married',
                },
                {
                  key: '2',
                  value: 'Unmarried',
                  label: 'Unmarried',
                },
              ]}
              styles="md:mr-4"
              errorMessage={errors.marital_status?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="purpose"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Purpose"
              value={value}
              onChange={onChange}
              options={LoanPurpose}
              errorMessage={errors.purpose?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="loanAmountRequired"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Loan required"
              value={value}
              onChange={onChange}
              options={LoanRequirementBrackets}
              styles="md:mr-4"
              errorMessage={errors.loanAmountRequired?.message}
              disabled={!!loading}
            />
          )}
        />
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
              styles="md:mr-4"
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
              onChange={onChange}
              value={value}
              errorMessage={errors.city?.message}
              disabled={!!loading}
              maxLength={6}
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

export default CreateLeadForm;
