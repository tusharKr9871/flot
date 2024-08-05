import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useFetchCustomerQueryServices = () => {
  const {
    data: customerQueryData,
    error: fetchCustomerQueryDataError,
    mutate: revalidateCustomerQueryServiceData,
    isLoading: isFetchingCustomerQueryServiceData,
  } = useSWR<string[]>(`/services/user-query-service`, fetcher);

  return {
    customerQueryData,
    fetchCustomerQueryDataError,
    revalidateCustomerQueryServiceData,
    isFetchingCustomerQueryServiceData,
  };
};
