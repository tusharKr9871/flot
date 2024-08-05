import useSWR from 'swr';
import { fetcher } from './fetcher';
import { Blob } from 'buffer';
import { axiosInstance } from '@/network/axiosInstance';
import { useDebounce } from '@/utils/use-debounce';

export type KYCDataType = {
  id: string;
  kycRequestId: string;
  videoFileId: string;
  frontAadharFileId: string;
  backAadharFileId: string;
  panCardFileId: string;
  kycLocation: string;
  aadharDob: string;
  aadharNo: string;
  aadharName: string;
  aadharFatherName: string;
  aadharAddress: string;
  idTypes: string;
  panDob: string;
  panNo: string;
  panName: string;
  panFatherName: string;
  status: string;
  requestDate: string;
  requestedBy: string;
};

export type BinaryResponse = Blob;

export type ESignDocRequestType = {
  id: string;
  eSignDocId: string;
  filename: string;
  status: string;
  requestDate: string;
  requestedBy: string;
};

export type KycDataType = {
  id: string;
  kycRequestId: string;
  name: string;
  email: string;
  leadId: string;
  kycLocation: string;
  status: string;
  requestDate: string;
  requestedBy: string;
};

type AllKycApiResponseType = {
  kycData: KycDataType[];
  count: number;
};

export type AllESignDocsType = {
  id: string;
  name: string;
  leadId: string;
  email: string;
  requestId: string;
  fileName: string;
  status: string;
  requestedBy: string;
  requestDate: string;
};

type AllESignDocsApiResponseType = {
  eSignDocs: AllESignDocsType[];
  count: number;
};

export const useVideoKYC = ({ leadId }: { leadId: string }) => {
  const {
    data: kycData,
    error: fetchKycDataError,
    mutate: revalidateKycData,
    isLoading: isFetchingKycData,
  } = useSWR<KYCDataType>(`/kyc/get-kyc-details/${leadId}`, fetcher);

  return {
    kycData,
    fetchKycDataError,
    revalidateKycData,
    isFetchingKycData,
  };
};

const fileFetcher = async (url: string) =>
  axiosInstance
    .get(url, { responseType: 'arraybuffer' })
    .then(response => response.data);

export const useKYCFiles = ({
  fileId,
  fileType,
}: {
  fileId: string;
  fileType: string;
}) => {
  const {
    data: kycFileData,
    error: fetchKycFileDataError,
    mutate: revalidateKycFileData,
    isLoading: isFetchingKycFileData,
  } = useSWR(`/kyc/get-kyc-files/${fileId}?fileType=${fileType}`, fileFetcher);

  return {
    kycFileData,
    fetchKycFileDataError,
    revalidateKycFileData,
    isFetchingKycFileData,
  };
};

export const useESignDocs = ({ leadId }: { leadId: string }) => {
  const {
    data: eSignDocsData,
    error: fetchESignDocsDataError,
    mutate: revalidateESignDocsData,
    isLoading: isFetchingESignDocsData,
  } = useSWR<ESignDocRequestType>(`/kyc/get-e-sign-docs/${leadId}`, fetcher);

  return {
    eSignDocsData,
    fetchESignDocsDataError,
    revalidateESignDocsData,
    isFetchingESignDocsData,
  };
};

export const useAllKyc = ({
  pageNumber,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const url = `/kyc/get-all-kyc?limit=${limit}&offset=${offset}`;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );
  const {
    data: allKycRequestsData,
    error: fetchAllKycRequestsDataError,
    mutate: revalidateAllKycRequestsData,
    isLoading: isFetchingAllKycRequestsData,
  } = useSWR<AllKycApiResponseType>(
    url ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    allKycRequestsData,
    fetchAllKycRequestsDataError,
    revalidateAllKycRequestsData,
    isFetchingAllKycRequestsData,
  };
};

export const useAllESignDocs = ({
  pageNumber,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const url = `/kyc/get-all-e-sign-docs?limit=${limit}&offset=${offset}`;
  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );
  const {
    data: allESignDocsData,
    error: fetchAllESignDocsDataError,
    mutate: revalidateESignDocsData,
    isLoading: isFetchingESignDocsData,
  } = useSWR<AllESignDocsApiResponseType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    allESignDocsData,
    fetchAllESignDocsDataError,
    revalidateESignDocsData,
    isFetchingESignDocsData,
  };
};
