'use client';

import InputContainer from '@/components/input-container';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputSelect from '@/components/input-select';
import PrimaryCTA from '@/components/primary-cta';
import { Title } from '@tremor/react';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import { defaultValuesType } from '@/components/user-data-table';
import { BranchCities } from '@/constants/branch';
import { UserRoles } from '@/constants/user-roles';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFetchUsers } from '@/hooks/user-api';

export type UserFormTypes = {
  name: string;
  email: string;
  mobile: string;
  branch: string;
  role: string;
  status: string;
};

const validationSchema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().required('Email required'),
  mobile: yup.string().required('Phone number required'),
  branch: yup.string().required('Branch is required'),
  role: yup.string().required('Role is required'),
  status: yup.string().required('Status is required'),
});

const UserForm = ({
  defaultValues,
  fromEdit = false,
  setIsModalOpen,
}: {
  defaultValues?: defaultValuesType;
  fromEdit?: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormTypes>({
    resolver: yupResolver(validationSchema),
  });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pageNumber = (searchParams.get('page') as unknown as number) || 1;
  const { revalidateUser } = useFetchUsers({ pageNumber });

  const onSubmit = async (data: UserFormTypes) => {
    setLoading(true);
    if (!fromEdit) {
      try {
        await axiosInstance.post('/user/add', {
          ...data,
          email: data.email.toLowerCase(),
        });
        toast.success('User Added!');
        reset({
          name: '',
          email: '',
          mobile: '',
          branch: '',
          role: '',
          status: '',
        });
        setLoading(false);
        setIsModalOpen(false);
        revalidateUser();
      } catch (e) {
        console.log(e);
        setLoading(false);
        toast.error('Error adding user!');
      }
    } else {
      try {
        await axiosInstance.put('/user/update', {
          ...data,
          user_id: defaultValues?.user_id,
        });
        toast.success('User Updated!');
        reset({
          name: '',
          email: '',
          mobile: '',
          branch: '',
          role: '',
          status: '',
        });
        setIsModalOpen(false);
        setLoading(false);
        revalidateUser();
      } catch (e) {
        console.log(e);
        toast.error('Error updating user!');
        setLoading(false);
      }
    }
  };

  return (
    <div className="">
      <Title className="pb-4">{fromEdit ? 'Edit User' : 'Add New User'}</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="name"
          control={control}
          defaultValue={defaultValues?.name}
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
          name="email"
          control={control}
          defaultValue={defaultValues?.email}
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
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="mobile"
          control={control}
          defaultValue={defaultValues?.mobile}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Phone Number"
              placeholder="Enter phone number"
              type="text"
              onChange={onChange}
              maxLength={10}
              value={value}
              styles="md:mr-4"
              errorMessage={errors.mobile?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="branch"
          control={control}
          defaultValue={defaultValues?.branch}
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
      </div>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="role"
          control={control}
          defaultValue={defaultValues?.role}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Role"
              value={value}
              onChange={onChange}
              options={UserRoles}
              styles="md:mr-4"
              errorMessage={errors.role?.message}
              disabled={!!loading}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          defaultValue={defaultValues?.status}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Status"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Active',
                  label: 'Active',
                },
                {
                  key: '2',
                  value: 'In_Active',
                  label: 'In Active',
                },
              ]}
              styles="md:mr-4"
              errorMessage={errors.status?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <div className="w-full justify-end flex">
        <PrimaryCTA
          ctaText={fromEdit ? 'Update' : 'Submit'}
          onClick={handleSubmit(onSubmit)}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserForm;
