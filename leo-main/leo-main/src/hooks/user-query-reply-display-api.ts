import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useFetchCustomerRepliedServices = () => {
  const {
    data: repliedData,
    error: fetchRepliedDataError,
    mutate: revalidateRepliedData,
    isLoading: isFetchingRepliedData,
  } = useSWR<string[]>(`/services/display-reply`, fetcher);

  return {
    repliedData,
    fetchRepliedDataError,
    revalidateRepliedData,
    isFetchingRepliedData,
  };
};
