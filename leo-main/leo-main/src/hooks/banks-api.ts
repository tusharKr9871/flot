import useSWR from 'swr';
import { fetcher } from './fetcher';
import { validateIFSC } from '@/utils/utils';

type BankDataType = {
  bank: string;
  ifsc: string;
  branch: string;
  address: string;
  contact: string;
  city: string;
  district: string;
  state: string;
};

export const useFetchBanks = ({ ifscCode }: { ifscCode: string }) => {
  const {
    data: bankData,
    error: fetchBankDataError,
    mutate: revalidateBankDate,
    isLoading: isFetchingBankData,
  } = useSWR<BankDataType>(
    validateIFSC(ifscCode) ? `/bank/get/${ifscCode}` : null,
    fetcher,
  );

  return {
    bankData,
    fetchBankDataError,
    revalidateBankDate,
    isFetchingBankData,
  };
};
