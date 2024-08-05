import useSWR from 'swr';
import { fetcher } from './fetcher';
import { getMonthNumber } from '@/utils/utils';

export type KpiCardData = {
  title: string;
  metric: number;
  progress: number;
  target: number;
};

export type PerformanceHistoryDataType = {
  date: string;
  ['Disbursals']: number;
  ['Collections']: number;
  ['Leads']: number;
};

export type teleCallerPerformanceType = {
  date: string;
  ['Documents Received']: number;
  ['Interested']: number;
};

export type CollectionDailyTrackType = {
  date: string;
  dueCases: number;
  loanAmount: number;
  repayAmount: number;
  collected: number;
  collectedCases: number;
  collectionPending: number;
  partPayment: number;
  partPaymentCases: number;
};

export type DisbursalRoleBarChartDataType = {
  name: string;
  ['Disbursal Amount']: number;
  ['Disbursal Target']: number;
};
export type creditManagerReporteeStats = {
  day: string;
  ['Disbursal']: number;
};

export type CollectionRoleBarChartDataType = {
  name: string;
  ['Collection Amount']: number;
  ['Collection Target']: number;
};

export type LineGraphDataType = {
  month: string;
  ['No. of Disbursal']: number;
  ['No. of Collections']: number;
};

export type DisbursalCollectionStatsDataType = {
  name: string;
  ['Today']: number;
  ['Month']: number;
  ['Year']: number;
};

export type DisbursalFreshReloanDataType =
  | {
      name: string;
      ['Fresh Disbursal Amount']: number;
      ['Fresh Cases']: number;
      ['Reloan Disbursal Amount']: number;
      ['Reloan Cases']: number;
    }[]
  | null;

export const useKpiCards = ({
  month,
  year,
  day,
}: {
  month?: string;
  year: string;
  day?: string;
}) => {
  let url = `/reports/stats?year=${year}`;
  if (day) {
    url = url + `&day=1`;
  }
  if (month) {
    url = url + `&month=${month}`;
  }
  const {
    data: kpiCardsData,
    error: fetchKpiCardsDataError,
    mutate: revalidateKpiCardsData,
    isLoading: isFetchingKpiCardsData,
  } = useSWR<KpiCardData[]>(url, fetcher);

  return {
    kpiCardsData,
    fetchKpiCardsDataError,
    revalidateKpiCardsData,
    isFetchingKpiCardsData,
  };
};

export const useAdminPerformanceHistory = ({
  year,
  month,
}: {
  year: string;
  month: string;
}) => {
  const url = `/admin-reports/performance-history?year=${year}`;
  const {
    data: adminPerformanceHistory,
    error: fetchAdminPerformanceHistoryError,
    mutate: revalidateAdminPerformanceHistory,
    isLoading: isFetchingAdminPerformanceHistory,
  } = useSWR<PerformanceHistoryDataType[]>(
    month ? url + `&month=${getMonthNumber(month)}` : url,
    fetcher,
  );

  return {
    adminPerformanceHistory,
    fetchAdminPerformanceHistoryError,
    revalidateAdminPerformanceHistory,
    isFetchingAdminPerformanceHistory,
  };
};

export const useTeleCallerPerformance = ({
  year,
  month,
}: {
  year: string;
  month: string;
}) => {
  const url = `/reports/telecaller-performance?year=${year}`;
  const {
    data: teleCallerPerformance,
    error: fetchTeleCallerPerformanceError,
    mutate: revalidateTeleCallerPerformance,
    isLoading: isFetchingTeleCallerPerformance,
  } = useSWR<[teleCallerPerformanceType]>(
    month ? url + `&month=${getMonthNumber(month)}` : url,
    fetcher,
  );

  return {
    teleCallerPerformance,
    fetchTeleCallerPerformanceError,
    revalidateTeleCallerPerformance,
    isFetchingTeleCallerPerformance,
  };
};

export const useAdminCollectionDailyReport = ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const url = `/admin-reports/collection-daily-track?month=${getMonthNumber(
    month,
  )}&year=${year}`;
  const {
    data: adminCollectionDailyTrack,
    error: fetchAdminCollectionDailyTrackError,
    mutate: revalidateAdminCollectionDailyTrack,
    isLoading: isFetchingAdminCollectionDailyTrack,
  } = useSWR<CollectionDailyTrackType[]>(url, fetcher);

  return {
    adminCollectionDailyTrack,
    fetchAdminCollectionDailyTrackError,
    revalidateAdminCollectionDailyTrack,
    isFetchingAdminCollectionDailyTrack,
  };
};

export const useRoleDisbursalAmount = ({
  role,
  month,
  year = new Date().getFullYear().toString(),
}: {
  role: string;
  month: string;
  year?: string;
}) => {
  const {
    data: roleDisbursalAmountData,
    error: fetchRoleDisbursalAmountError,
    mutate: revalidateRoleDisbursalAmountData,
    isLoading: isFetchingRoleDisbursalAmountData,
  } = useSWR<DisbursalRoleBarChartDataType[]>(
    `/admin-reports/disbursal-role-data-report/${role}?month=${getMonthNumber(
      month,
    )}&year=${year}`,
    fetcher,
  );

  return {
    roleDisbursalAmountData,
    fetchRoleDisbursalAmountError,
    revalidateRoleDisbursalAmountData,
    isFetchingRoleDisbursalAmountData,
  };
};

export const useCreditManagerReporteeStats = ({
  month,
  year = new Date().getFullYear().toString(),
}: {
  month: string;
  year?: string;
}) => {
  const url = `/reports/credit-manager-disbursal-performance?year=${year}`;
  const {
    data: creditManagerReporteeStats,
    error: fetchCreditManagerReporteeStatsError,
    mutate: revalidateCreditManagerReporteeStats,
    isLoading: isFetchingCreditManagerReporteeStats,
  } = useSWR<creditManagerReporteeStats[]>(
    month ? url + `&month=${getMonthNumber(month)}` : url,
    fetcher,
  );
  return {
    creditManagerReporteeStats,
    fetchCreditManagerReporteeStatsError,
    revalidateCreditManagerReporteeStats,
    isFetchingCreditManagerReporteeStats,
  };
};

export const useRoleCollectionAmount = ({
  role,
  month,
  year = new Date().getFullYear().toString(),
}: {
  role: string;
  month: string;
  year?: string;
}) => {
  const {
    data: roleCollectionAmountData,
    error: fetchRoleCollectionAmountError,
    mutate: revalidateRoleCollectionAmountData,
    isLoading: isFetchingRoleCollectionAmountData,
  } = useSWR<CollectionRoleBarChartDataType[]>(
    `/admin-reports/collection-role-data-report/${role}?month=${getMonthNumber(
      month,
    )}&year=${year}`,
    fetcher,
  );

  return {
    roleCollectionAmountData,
    fetchRoleCollectionAmountError,
    revalidateRoleCollectionAmountData,
    isFetchingRoleCollectionAmountData,
  };
};

export const useCollectionExecutiveAmount = ({
  month,
  year = new Date().getFullYear().toString(),
}: {
  month: string;
  year?: string;
}) => {
  const {
    data: collectionExecutiveAmount,
    error: fetchCollectionExecutiveAmountError,
    mutate: revalidateCollectionExecutiveAmountData,
    isLoading: isFetchingCollectionExecutiveAmountData,
  } = useSWR<CollectionRoleBarChartDataType[]>(
    `/reports/collection-executive-data-report/?month=${getMonthNumber(
      month,
    )}&year=${year}`,
    fetcher,
  );

  return {
    collectionExecutiveAmount,
    fetchCollectionExecutiveAmountError,
    revalidateCollectionExecutiveAmountData,
    isFetchingCollectionExecutiveAmountData,
  };
};

export const useDisbursalCollectionStats = () => {
  const {
    data: disbursalCollectionStatsData,
    error: fetchDisbursalCollectionStatsError,
    mutate: revalidateDisbursalCollectionStatsData,
    isLoading: isFetchingDisbursalCollectionStatsData,
  } = useSWR<DisbursalCollectionStatsDataType[]>(
    `/admin-reports/disbursal-collection-stats`,
    fetcher,
  );

  return {
    disbursalCollectionStatsData,
    fetchDisbursalCollectionStatsError,
    revalidateDisbursalCollectionStatsData,
    isFetchingDisbursalCollectionStatsData,
  };
};

export const useDisbursalFreshReloan = ({
  role,
  month,
  year,
}: {
  role: string;
  month: string;
  year: string;
}) => {
  const {
    data: disbursalFreshReloanData,
    error: fetchDisbursalCollectionStatsError,
    mutate: revalidateDisbursalFreshReloanData,
    isLoading: isFetchingDisbursalFreshReloanData,
  } = useSWR<DisbursalFreshReloanDataType>(
    `/admin-reports/fresh-reloan-stats?role=${role}&month=${getMonthNumber(
      month,
    )}&year=${year}`,
    fetcher,
  );

  return {
    disbursalFreshReloanData,
    fetchDisbursalCollectionStatsError,
    revalidateDisbursalFreshReloanData,
    isFetchingDisbursalFreshReloanData,
  };
};
