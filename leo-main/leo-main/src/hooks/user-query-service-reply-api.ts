import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useFetchCustomerQueryServicesReply = () => {
  const {
    data: repliedData,
    error: fetchCustomerQueryReplyDataError,
    mutate: revalidateCustomerQueryServiceReplyData,
    isLoading: isFetchingCustomerQueryServiceReplyData,
  } = useSWR<string[]>(`/services/user-query-service-reply`, fetcher);

  return {
    repliedData,
    fetchCustomerQueryReplyDataError,
    revalidateCustomerQueryServiceReplyData,
    isFetchingCustomerQueryServiceReplyData,
  };
};
