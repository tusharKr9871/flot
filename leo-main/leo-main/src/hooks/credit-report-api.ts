import useSWR from 'swr';
import { fetcher } from './fetcher';

export type GetLiablityType = {
  id: string;
  leadId: string;
  liabilityName: string;
  credit: number;
  debit: number;
};

type CreditReportType = {
  id: string;
  grossIncome: number[];
  obligation: number;
  bandPercent: number;
  foirScore: number;
  eligibleAmount: number;
  liabilities: GetLiablityType[];
  netIncome: number;
};

export const useCreditReportApi = ({ leadId }: { leadId: string }) => {
  const {
    data: creditReportData,
    error: fetchCreditReportDataError,
    mutate: revalidateCreditReportData,
    isLoading: isFetchingCreditReportData,
    isValidating: isValidatingCreditReportData,
  } = useSWR<CreditReportType>(`/credit-report/get/${leadId}`, fetcher);

  return {
    creditReportData,
    fetchCreditReportDataError,
    revalidateCreditReportData,
    isFetchingCreditReportData,
    isValidatingCreditReportData,
  };
};
