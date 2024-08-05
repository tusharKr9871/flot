import useSWR from 'swr';
import { fetcher } from './fetcher';

export type AuditLogsType = {
  id: string;
  activity: string;
  userName: string;
  userRole: string;
  eventType: string;
  createdAt: string;
};

type AuditLogsApiResponseType = {
  auditLogs: AuditLogsType[];
  auditLogsCount: number;
};

export const useAuditLogs = ({ pageNumber = 1 }: { pageNumber: number }) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;

  const url = `/audit-logs/get-logs?limit=${limit}&offset=${offset}`;
  const {
    data: auditLogsData,
    error: fetchAuditLogsDataError,
    mutate: revalidateAuditLogsData,
    isLoading: isFetchingAuditLogsData,
  } = useSWR<AuditLogsApiResponseType>(url, fetcher);

  return {
    auditLogsData,
    fetchAuditLogsDataError,
    revalidateAuditLogsData,
    isFetchingAuditLogsData,
  };
};
