import useSWR from 'swr';
import { fetcher } from './fetcher';

export type CallHistoryType = {
  id: string;
  leadId: string;
  callType: string;
  status: string;
  remark: string;
  calledBy: string;
  createdAt: string;
};

export const useCallHistory = ({ leadId }: { leadId: string }) => {
  const {
    data: callHistoryForLead,
    error: fetchCallHistoryError,
    mutate: revalidateCallHistory,
    isLoading: isFetchingCallHistory,
  } = useSWR<CallHistoryType[]>(`/call-history/get/${leadId}`, fetcher);

  return {
    callHistoryForLead,
    fetchCallHistoryError,
    revalidateCallHistory,
    isFetchingCallHistory,
  };
};
