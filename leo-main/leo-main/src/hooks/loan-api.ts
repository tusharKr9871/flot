import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useDebounce } from '@/utils/use-debounce';
import { format } from 'date-fns';

type LoanDetailsType = {
  loanNo: string;
  branch: string;
  loanDisbursed: number;
  roi: number;
  noOfDays: number;
  realDays: number;
  penaltyDays: number;
  bouncingCharges: number;
  currentDate: string;
  paidAmount: number;
  repaymentAmount: number;
  totalInterest: number;
  penaltyInterest: number;
  currentRepayAmount: number;
};

export type BankUpdateLoansDataType = {
  id: string;
  leadId: string;
  loanNo: string;
  name: string;
  branch: string;
  loanType: string;
  phoneNo: string;
  email: string;
  approvalAmount: number;
  disbursalAmount: number;
  approvalDate: string;
  disbursalDate: string;
  roi: number;
  tenure: number;
  processingFeePercent: number;
  processingFee: number;
  conversionFeesPercent: number;
  conversionFees: number;
  accountNumber: string;
  bankName: string;
  bankBranch: string;
  ifscCode: string;
  cibil: number;
  approvedBy: string;
};

type BankUpdateLoansApiResponse = {
  bankUpdateData: BankUpdateLoansDataType[];
  bankUpdateCount: number;
};

export type PendingLoansDataType = {
  id: string;
  leadId: string;
  collectionUser: string;
  daysPastDue: number;
  loanNo: string;
  name: string;
  phoneNo: string;
  email: string;
  loanAmount: number;
  tenure: number;
  roi: number;
  repaymentAmount: number;
  currentRepaymentAmount: number;
  repayDate: string;
  penalty: number;
  status: string;
  creditedBy: string;
  remarks: string;
};
export type DownloadPendingLoansDataType = {
  pendingLoans: PendingLoansDataType[];
};

type PendingLoansApiResponse = {
  loans: PendingLoansDataType[];
  loansCount: number;
};

type LoanHistoryData = {
  leadId: string;
  loanNo: string;
  loanAmount: number;
  roi: number;
  days: number;
  repayDate: string;
  collectionDate: string;
  credit: string;
  status: string;
  collectionRemark: string;
};

type EMIDataType = {
  emiId: string;
  emiLoanNo: string;
  emiDate: string;
  emiAmount: number;
  emiStatus: string;
  emiCreatedAt: string;
  emiUpdatedAt: string;
};

export const useLoanData = ({ leadId }: { leadId: string }) => {
  const {
    data: loanData,
    error: fetchLoanDataError,
    mutate: revalidateLoanData,
    isLoading: isFetchingLoanData,
  } = useSWR<LoanDetailsType>(`/loan/get/${leadId}`, fetcher);

  return {
    loanData,
    fetchLoanDataError,
    revalidateLoanData,
    isFetchingLoanData,
  };
};

export const useBankUpdateLoans = ({
  pageNumber,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const url = `/loan/get-bank-update?limit=${limit}&offset=${offset}`;

  const {
    data: bankUpdateLoansData,
    error: fetchBankUpdateLoansDataError,
    mutate: revalidateBankUpdateLoansData,
    isLoading: isFetchingBankUpdateLoansData,
  } = useSWR<BankUpdateLoansApiResponse>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    bankUpdateLoansData,
    fetchBankUpdateLoansDataError,
    revalidateBankUpdateLoansData,
    isFetchingBankUpdateLoansData,
  };
};

export const usePendingLoans = ({
  pageNumber,
  loanFilter,
  searchTerm,
  startDate,
  endDate,
  assigneeId,
}: {
  pageNumber: number;
  loanFilter: string;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  assigneeId?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );
  const MAX_INT = Number.MAX_SAFE_INTEGER;

  let url = `/loan/get-payday-pending-loans?loanFilter=${loanFilter}`;

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  if (assigneeId) {
    url += `&assigneeId=${assigneeId}`;
    url += `&limit=${MAX_INT}&offset=${0}`;
  } else {
    url += `&limit=${limit}&offset=${offset}`;
  }

  const {
    data: pendingLoansData,
    error: fetchPendingLoansDataError,
    mutate: revalidatePendingLoansData,
    isLoading: isFetchingPendingLoansData,
  } = useSWR<PendingLoansApiResponse>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    pendingLoansData,
    fetchPendingLoansDataError,
    revalidatePendingLoansData,
    isFetchingPendingLoansData,
  };
};

export const useLoanHistory = ({ leadId }: { leadId: string }) => {
  const {
    data: loanHistoryData,
    error: fetchLoanHistoryError,
    mutate: revalidateLoanHistoryData,
    isLoading: isFetchingLoanHistoryData,
  } = useSWR<LoanHistoryData[]>(`/loan/loan-history/${leadId}`, fetcher);

  return {
    loanHistoryData,
    fetchLoanHistoryError,
    revalidateLoanHistoryData,
    isFetchingLoanHistoryData,
  };
};

export const useGetEMILoan = ({ leadId }: { leadId: string }) => {
  const {
    data: emiLoanData,
    error: fetchEMILoanDataError,
    mutate: revalidateEMILoanData,
    isLoading: isFetchingEMILoanData,
  } = useSWR<EMIDataType[]>(`/loan/get-emi-loan/${leadId}`, fetcher);

  return {
    emiLoanData,
    fetchEMILoanDataError,
    revalidateEMILoanData,
    isFetchingEMILoanData,
  };
};
