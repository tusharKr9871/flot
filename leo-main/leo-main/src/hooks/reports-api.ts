import { useDebounce } from '@/utils/use-debounce';
import useSWR from 'swr';
import { fetcher } from './fetcher';
import { format } from 'date-fns';

export type CollectionReportType = {
  id: string;
  leadId: string;
  loanNo: string;
  name: string;
  mobile: string;
  employerName: string;
  loanAmount: number;
  processingFee: number;
  disbursalDate: string;
  collectedAmount: number;
  penalty: number;
  collectedMode: string;
  collectionDate: string;
  collectionTime: string;
  referenceNo: string;
  totalCollectionAmount: number;
  status: string;
  remark: string;
  createdAt: string;
};

type CollectionReportApiResponse = {
  collectionsReport: CollectionReportType[];
  count: number;
};

export type DisbursalReportType = {
  id: string;
  leadId: string;
  loanNo: string;
  branch: string;
  loanType: string;
  name: string;
  creditManager: string;
  gender: string;
  dob: string;
  personalEmail: string;
  officeEmail: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  addressCategory: string;
  aadharNumber: string;
  panCard: string;
  loanAmount: number;
  approvalDate: string;
  disbursalAmount: number;
  tenure: number;
  roi: number;
  disbursalDate: string;
  accountNo: string;
  accountType: string;
  ifsc: string;
  bank: string;
  bankBranch: string;
  disbursalReferenceNo: string;
  processingFee: number;
  monthlyIncome: number;
  cibil: number;
  gstFee: number;
  utmSource: string;
  status: string;
};

type DisbursalReportApiResponse = {
  disbursalReports: DisbursalReportType[];
  count: number;
};

export type CibilDataType = {
  id: string;
  name: string;
  dob: string;
  gender: string;
  pan: string;
  aadhar: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  loanNo: string;
  amount: number;
  disbursalDate: string;
  repaymentDate: string;
  collectionStatus: string;
  closureDate: string;
  currentBalance: number;
  amountOverdue: number;
  overDueDays: number;
};

type CibilDataApiResponse = {
  cibilData: CibilDataType[];
  count: number;
};

export const useCollectionReport = ({
  pageNumber,
  searchTerm,
  startDate,
  endDate,
}: {
  pageNumber: number;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  let url = `/reports/collections?limit=${limit}&offset=${offset}`;

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: collectionReportData,
    error: fetchCollectionReportDataError,
    mutate: revalidateCollectionReportData,
    isLoading: isFetchingCollectionReportData,
  } = useSWR<CollectionReportApiResponse>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    collectionReportData,
    fetchCollectionReportDataError,
    revalidateCollectionReportData,
    isFetchingCollectionReportData,
  };
};

export const useDisbursalReport = ({
  pageNumber,
  searchTerm,
  startDate,
  endDate,
}: {
  pageNumber: number;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  let limit = 10;
  let offset = (pageNumber - 1) * 10;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  if (searchTerm) {
    limit = Number.MAX_SAFE_INTEGER;
    offset = 0;
  }

  let url = `/reports/disbursal?limit=${limit}&offset=${offset}`;

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: disbursalReportData,
    error: fetchDisbursalReportDataError,
    mutate: revalidateDisbursalReportData,
    isLoading: isFetchingDisbursalReportData,
  } = useSWR<DisbursalReportApiResponse>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    disbursalReportData,
    fetchDisbursalReportDataError,
    revalidateDisbursalReportData,
    isFetchingDisbursalReportData,
  };
};

export const useFetchCibilData = ({
  pageNumber,
  searchTerm,
  startDate,
  endDate,
}: {
  pageNumber: number;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  let url = `/reports/cibil-data?limit=${limit}&offset=${offset}`;

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: cibilData,
    error: fetchCibilDataError,
    mutate: revalidateCibilData,
    isLoading: isFetchingCibilData,
  } = useSWR<CibilDataApiResponse>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    cibilData,
    fetchCibilDataError,
    revalidateCibilData,
    isFetchingCibilData,
  };
};
