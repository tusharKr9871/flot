import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useFetchCustomerServices = () => {
  const {
    data: servicesData,
    error: fetchServicesDataError,
    mutate: revalidateServicesData,
    isLoading: isFetchingServicesData,
  } = useSWR<{ balance: string }>(`/services/sms-balance`, fetcher);

  return {
    servicesData,
    fetchServicesDataError,
    revalidateServicesData,
    isFetchingServicesData,
  };
};
