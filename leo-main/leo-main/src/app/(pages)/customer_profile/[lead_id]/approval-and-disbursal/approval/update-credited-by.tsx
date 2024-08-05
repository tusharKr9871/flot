import InputSelect, { Option } from '@/components/input-select';
import { Divider, Title } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import PrimaryCTA from '@/components/primary-cta';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import Loader from '@/components/loader';

type UpdateCreditedByFormType = {
  creditedBy: string;
};

const updateApprovalValidationSchema = yup.object().shape({
  creditedBy: yup.string().required('Credited By is required'),
});

const UpdateCreditedBy = ({ leadId }: { leadId: string }) => {
  const [loading, setLoading] = useState(false);
  const [sanctionOfficers, setSanctionOfficers] = useState<Option[]>([]);

  const {
    usersByRoleAndBranchData: creditManagers,
    isFetchingUsersByRoleAndBranch: isFetchingCreditManagers,
  } = useFetchUsersByRoleAndBranch({
    role: 'Credit_Manager',
    branch: '',
  });
  const {
    usersByRoleAndBranchData: loanOfficers,
    isFetchingUsersByRoleAndBranch: isFetchingLoanOfficers,
  } = useFetchUsersByRoleAndBranch({
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

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateCreditedByFormType>({
    resolver: yupResolver(updateApprovalValidationSchema),
  });

  const onUpdate = async (data: UpdateCreditedByFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/approval/update-credited-by/${leadId}`, {
        creditedBy: data.creditedBy,
      });
      toast.success('Updated Successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
      Sentry.captureException(error);
    }
  };

  if (isFetchingCreditManagers || isFetchingLoanOfficers) {
    return <Loader />;
  }

  return (
    <>
      <Title className="pb-4">Update Credited By</Title>
      <div className="md:flex flex-row justify-between">
        <Controller
          name="creditedBy"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Credited By"
              value={value}
              onChange={onChange}
              options={sanctionOfficers}
              styles="md:mr-4"
              errorMessage={errors.creditedBy?.message}
              disabled={!!loading}
            />
          )}
        />
      </div>
      <Divider />
      <PrimaryCTA ctaText="Update" onClick={handleSubmit(onUpdate)} />
    </>
  );
};

export default UpdateCreditedBy;
