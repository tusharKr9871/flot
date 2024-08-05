import useSWR from 'swr';
import { fetcher } from './fetcher';
import { LeadsDataType } from '@/components/leads-data-table';
import { useDebounce } from '@/utils/use-debounce';
import { format } from 'date-fns';

export type LeadDataType = {
  id: string;
  purpose: string;
  loanRequired: number;
  tenure: number;
  monthlyIncome: number;
  city: string;
  state: string;
  pincode: number;
  utmSource: string;
  domain: string;
  status: string;
  leadAssignee: string;
  creditManager: string;
  loanCount: string;
  waiverApprovalStatus: string;
  createdAt: string;
};

type LeadsApiDataType = {
  leads: LeadsDataType[];
  leadsCount: number;
};

type LeadHistoryDataType = {
  id: string;
  requiredAmount: number;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
  city: string;
  state: string;
  pincode: string;
  source: string;
  status: string;
  createdAt: string;
};

export type CreditLeadsType = {
  id: string;
  loanType: string;
  branch: string;
  name: string;
  email: string;
  phoneNo: string;
  loanAmount: number;
  tenure: number;
  roi: number;
  repayDate: string;
  processingFee: number;
  monthlyIncome: number;
  cibil: number;
  creditedBy: string;
  status: string;
  updatedAt: string;
  createdAt: string;
};

export type DisbursalLeadsType = CreditLeadsType & {
  loanNo: string;
  disbursalAmount: number;
  disbursalDate: string;
  referenceNo: string;
};

type DisbursalLeadsApiDataType = {
  leads: DisbursalLeadsType[];
  leadsCount: number;
};

export const useFetchLeads = ({
  pageNumber = 1,
  searchTerm,
  leadType,
  startDate,
  endDate,
  assigneeId,
}: {
  pageNumber: number;
  searchTerm?: string;
  leadType?: string;
  startDate?: Date;
  endDate?: Date;
  assigneeId?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  let url: string;
  if (leadType) {
    url = `/leads/get-leads-by-filter?limit=${limit}&offset=${offset}&leads=${leadType}`;
  } else {
    url = `/leads/get-leads-by-filter?limit=${limit}&offset=${offset}`;
  }
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }
  if (assigneeId) {
    url += `&assigneeId=${assigneeId}`;
  }

  const {
    data: allLeads,
    error: fetchLeadsError,
    mutate: revalidateLeads,
    isLoading: isFetchingLeads,
  } = useSWR<LeadsApiDataType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return { allLeads, fetchLeadsError, revalidateLeads, isFetchingLeads };
};

export const useFetchLead = ({ leadId }: { leadId: string }) => {
  const {
    data: leadData,
    error: fetchLeadError,
    mutate: revalidateLead,
    isLoading: isFetchingLead,
  } = useSWR<LeadDataType>(`/leads/${leadId}`, fetcher);

  return { leadData, fetchLeadError, revalidateLead, isFetchingLead };
};

export const useFetchLeadHistory = ({ leadId }: { leadId: string }) => {
  const {
    data: leadHistoryData,
    error: fetchLeadHistoryError,
    mutate: revalidateLeadHistory,
    isLoading: isFetchingLeadHistory,
  } = useSWR<LeadHistoryDataType[]>(`/leads/leadHistory/${leadId}`, fetcher);

  return {
    leadHistoryData,
    fetchLeadHistoryError,
    revalidateLeadHistory,
    isFetchingLeadHistory,
  };
};

export const useFetchCreditLeads = ({
  pageNumber = 1,
  leadType,
  searchTerm,
  startDate,
  endDate,
}: {
  pageNumber: number;
  leadType?: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  let url;
  if (leadType) {
    url = `/leads/get/credit-leads-by-filter?limit=${limit}&offset=${offset}&leads=${leadType}`;
  } else {
    url = `/leads/get/credit-leads-by-filter?limit=${limit}&offset=${offset}`;
  }
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: allLeads,
    error: fetchLeadsError,
    mutate: revalidateLeads,
    isLoading: isFetchingLeads,
  } = useSWR<DisbursalLeadsApiDataType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return { allLeads, fetchLeadsError, revalidateLeads, isFetchingLeads };
};

export const useFetchDisbursalLeads = ({
  pageNumber = 1,
  leadType,
  searchTerm,
  startDate,
  endDate,
}: {
  pageNumber: number;
  leadType?: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  let url;
  if (leadType) {
    url = `/leads/get/disbursal-leads-by-filter?limit=${limit}&offset=${offset}&leads=${leadType}`;
  } else {
    url = `/leads/get/disbursal-leads-by-filter?limit=${limit}&offset=${offset}`;
  }
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: disbursalLeads,
    error: fetchDisbursalLeadsError,
    mutate: revalidateDisbursalLeads,
    isLoading: isFetchingDisbursalLeads,
  } = useSWR<DisbursalLeadsApiDataType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    disbursalLeads,
    fetchDisbursalLeadsError,
    revalidateDisbursalLeads,
    isFetchingDisbursalLeads,
  };
};
