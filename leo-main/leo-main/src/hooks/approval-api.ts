import useSWR from 'swr';
import { fetcher } from './fetcher';

export type LoanApprovalFormType = {
  branch: string;
  approvalAmount: number;
  roi: number;
  salaryDate: Date;
  repayDate: Date;
  processingFeePercent: number;
  processingFee: number;
  conversionFeesPercent: number;
  conversionFees: number;
  gst: number;
  alternateNumber: string;
  email: string;
  cibilScore: number;
  monthlyIncome: number;
  status: string;
  remark: string;
  loanPurpose: string;
};

export type EMILoanApprovalFormType = Omit<
  LoanApprovalFormType,
  'salaryDate' | 'repayDate'
> & {
  conversionFeesPercent: number;
  conversionFees: number;
};

type LoanApprovalType =
  | (Omit<
      LoanApprovalFormType,
      'salaryDate' | 'repayDate' | 'outstandingAmount'
    > & {
      id: string;
      loanType: string;
      loanNo: string;
      loanTenure: number;
      salaryDate: string;
      repayDate: string;
      creditedBy: string;
      approvalDate: string;
      additionalRemark: string;
      sanctionLetterStatus: string;
    })
  | null;

type LoanApprovalLetterType = {
  customerName: string;
  applicationId: string;
  approvalDate: string;
  approvalAmount: number;
  roi: number;
  processingFeesPercent: number;
  processingFees: number;
  gstAmount: number;
  totalDeductions: number;
  disbursalAmount: number;
  repayDate: string;
  repayAmount: number;
};

type LoanPdVisitLetterType = {
  id: string;
  visitDate: string;
  visitTime: string;
  pdName: string;
} | null;

export const useLoanApproval = ({ leadId }: { leadId: string }) => {
  const {
    data: loanApprovalData,
    error: fetchLoanApprovalDataError,
    mutate: revalidateLoanApprovalData,
    isLoading: isFetchingLoanApprovalData,
  } = useSWR<LoanApprovalType>(`/approval/get/${leadId}`, fetcher);

  return {
    loanApprovalData,
    fetchLoanApprovalDataError,
    revalidateLoanApprovalData,
    isFetchingLoanApprovalData,
  };
};

export const useExistingLoanApproval = ({ leadId }: { leadId: string }) => {
  const {
    data: existingLoanApprovalData,
    error: fetchExistingLoanApprovalDataError,
    mutate: revalidateExistingLoanApprovalData,
    isLoading: isFetchingExisitingLoanApprovalData,
  } = useSWR<LoanApprovalType>(`/approval/get-existing/${leadId}`, fetcher);

  return {
    existingLoanApprovalData,
    fetchExistingLoanApprovalDataError,
    revalidateExistingLoanApprovalData,
    isFetchingExisitingLoanApprovalData,
  };
};

export const useLoanApprovalLetter = ({ leadId }: { leadId: string }) => {
  const {
    data: loanApprovalLetterData,
    error: fetchLoanApprovalLetterDataError,
    mutate: revalidateLoanApprovalLetterData,
    isLoading: isFetchingLoanApprovalLetterData,
  } = useSWR<LoanApprovalLetterType>(
    `/approval/get-sanction-letter/${leadId}`,
    fetcher,
  );

  return {
    loanApprovalLetterData,
    fetchLoanApprovalLetterDataError,
    revalidateLoanApprovalLetterData,
    isFetchingLoanApprovalLetterData,
  };
};

export const usePdVisitLetter = ({ leadId }: { leadId: string }) => {
  const {
    data: pdVisitLetterData,
    error: fetchPdVisitLetterDataError,
    mutate: revalidatePdVisitLetterData,
    isLoading: isFetchingPdVisitLetterData,
  } = useSWR<LoanPdVisitLetterType>(`/pd-visit/get/${leadId}`, fetcher);

  return {
    pdVisitLetterData,
    fetchPdVisitLetterDataError,
    revalidatePdVisitLetterData,
    isFetchingPdVisitLetterData,
  };
};
