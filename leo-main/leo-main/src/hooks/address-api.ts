import useSWR from 'swr';
import { fetcher } from './fetcher';

export type CustomerAddressFormType = {
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  houseType: string;
  status: string;
};

type CustomerAddressType = CustomerAddressFormType & {
  id: string;
  verifiedBy: string;
};

export const useCustomerAddress = ({ leadId }: { leadId: string }) => {
  const {
    data: customerAddressData,
    error: fetchCustomerAddressError,
    mutate: revalidateCustomerAddress,
    isLoading: isFetchingCustomerAddress,
  } = useSWR<CustomerAddressType[]>(`/address/getAddress/${leadId}`, fetcher);

  return {
    customerAddressData,
    fetchCustomerAddressError,
    revalidateCustomerAddress,
    isFetchingCustomerAddress,
  };
};
