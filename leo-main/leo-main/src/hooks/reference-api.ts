import useSWR from 'swr';
import { fetcher } from './fetcher';

export type ReferenceFormType = {
  name: string;
  relation: string;
  mobile: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

export type ReferenceType = Omit<ReferenceFormType, 'mobile'> & {
  id: string;
  phoneNo: string;
};

export const useReferenceDetails = ({ leadId }: { leadId: string }) => {
  const {
    data: referenceData,
    error: fetchReferenceError,
    mutate: revalidateReferenceData,
    isLoading: isFetchingReferenceData,
  } = useSWR<ReferenceType[]>(`/reference/get/${leadId}`, fetcher);

  return {
    referenceData,
    fetchReferenceError,
    revalidateReferenceData,
    isFetchingReferenceData,
  };
};
