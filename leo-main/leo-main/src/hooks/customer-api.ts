import useSWR from 'swr';
import { fetcher } from './fetcher';

export type CustomerDataType = {
  id: string;
  customerName: string;
  customerPicture: string;
  email: string;
  phoneNo: string;
  gender: string;
  createdAt: string;
  pan: string;
  aadhar: string;
  dob: string;
  city: string;
  status: string;
};

export const useFetchCustomerByLead = ({ leadId }: { leadId: string }) => {
  const {
    data: customerData,
    error: fetchCustomerDataError,
    mutate: revalidateCustomerData,
    isLoading: isFetchingCustomerData,
  } = useSWR<CustomerDataType>(`/customer/lead/${leadId}`, fetcher);

  return {
    customerData,
    fetchCustomerDataError,
    revalidateCustomerData,
    isFetchingCustomerData,
  };
};
