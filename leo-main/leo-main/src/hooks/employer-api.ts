import useSWR from 'swr';
import { fetcher } from './fetcher';

export type EmployerFormType = {
  employerName: string;
  totalExperience: string;
  currentCompanyExperience: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
};

export type EmployerType = Omit<EmployerFormType, 'employerName'> & {
  id: string;
  name: string;
  verifiedBy: string;
  createdAt: string;
  updatedAt: string;
};

export const useCustomerEmployer = ({ leadId }: { leadId: string }) => {
  const {
    data: employerData,
    error: fetchEmployerError,
    mutate: revalidateEmployerData,
    isLoading: isFetchingEmployerData,
  } = useSWR<EmployerType[]>(`/employer/get/${leadId}`, fetcher);

  return {
    employerData,
    fetchEmployerError,
    revalidateEmployerData,
    isFetchingEmployerData,
  };
};
