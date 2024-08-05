import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from './fetcher';

type LoanDisbursalDataType = {
  id: string;
  disbursalAmount: number;
  companyAccountNo: string;
  accountNo: string;
  accountType: string;
  bankName: string;
  ifscCode: string | null;
  bankBranch: string;
  chequeNo: string | null;
  disbursalDate: string;
  utrNo: string;
  finalRemark: string;
  disbursedBy: string;
  pdDoneBy: string;
  pdDate: string;
};

type AutoDisbursalType = {
  status: string;
  utr: string;
};

export const useLoanDisbursal = ({ leadId }: { leadId: string }) => {
  const {
    data: loanDisbursalData,
    error: fetchLoanDisbursalDataError,
    mutate: revalidateLoanDisbursalData,
    isLoading: isFetchingLoanDisbursalData,
  } = useSWR<LoanDisbursalDataType>(`/disbursal/get/${leadId}`, fetcher);

  return {
    loanDisbursalData,
    fetchLoanDisbursalDataError,
    revalidateLoanDisbursalData,
    isFetchingLoanDisbursalData,
  };
};

export const useExisitingLoanDisbursal = ({ leadId }: { leadId: string }) => {
  const {
    data: exisitingloanDisbursalData,
    error: fetchExisitingLoanDisbursalDataError,
    mutate: revalidateExisitingLoanDisbursalData,
    isLoading: isFetchingExisitingLoanDisbursalData,
  } = useSWR<LoanDisbursalDataType>(
    `/disbursal/get-existing/${leadId}`,
    fetcher,
  );

  return {
    exisitingloanDisbursalData,
    fetchExisitingLoanDisbursalDataError,
    revalidateExisitingLoanDisbursalData,
    isFetchingExisitingLoanDisbursalData,
  };
};

export const useAutoLoanDisbursal = ({ leadId }: { leadId: string }) => {
  const {
    data: autoLoanDisbursalData,
    error: fetchAutoLoanDisbursalDataError,
    mutate: revalidateAutoLoanDisbursalData,
    isLoading: isFetchingAutoLoanDisbursalData,
  } = useSWRImmutable<AutoDisbursalType>(
    `/auto-disbursal/get-transfer-info/${leadId}`,
    fetcher,
  );

  return {
    autoLoanDisbursalData,
    fetchAutoLoanDisbursalDataError,
    revalidateAutoLoanDisbursalData,
    isFetchingAutoLoanDisbursalData,
  };
};
