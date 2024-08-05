import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useDebounce } from '@/utils/use-debounce';
import { format } from 'date-fns';

export type CollectionDetailsFormType = {
  collectionAmount: number;
  penaltyAmount: number;
  collectionMode: string;
  collectionTime?: string;
  referenceNo: string;
  collectedDate: Date;
  discountAmount: number;
  settlementAmount: number;
  status: string;
  remarks: string;
};

export type collectionDataType = Omit<
  CollectionDetailsFormType,
  'collectedDate'
> & {
  id: string;
  loanNo: string;
  collectedBy: string;
  collectionDate: string;
  createdAt: string;
};

export type CollectionsType = {
  id: string;
  leadId: string;
  collectionUser: string;
  loanNo: string;
  name: string;
  email: string;
  phoneNo: string;
  employerName: string;
  repayDate: string;
  paymentAmount: number;
  paymentMode: string;
  paymentDate: string;
  referenceNo: string;
  discountAmount: number;
  settlementAmount: number;
  status: string;
  createdAt: string;
};

type CollectionApiDatatype = {
  collections: CollectionsType[];
  collectedLeadsCount: number;
};

export type CollectionTimelineType = {
  id: string;
  leadId: string;
  relatedTo: string;
  customerResponse: string;
  contactedBy: string;
  createdAt: string;
};

export type WaiverRequest = {
  id: string;
  daysPastDue: number;
  loanNo: string;
  name: string;
  approvalAmount: number;
  repayAmount: number;
  repayDate: string;
  penalty: number;
  waiverAmountType: string;
  waiverAmount: number;
  actualRepaymentAmount: number;
  status: string;
};

export type AllWaiverRequests = {
  waiverRequests: WaiverRequest[];
  waiverRequestCount: number;
};

export type Collections = {
  id: string;
  collectionUser: string;
  loanNo: string;
  customerName: string;
  mobileNo: string;
  loanAmount: number;
  disbursalDate: string;
  repayAmount: number;
  repayDate: string;
  penalty: number;
  status: string;
  remarks: string;
};

type AllCollections = {
  collections: Collections[];
  collectionsCount: number;
};

type ExtensionAmount = {
  approvalAmount: number;
  currentRepayAmount: number;
  totalInterest: number;
  penaltyInterest: number;
  extensionAmount: number;
};

type CollectionDocumentType = {
  documentId: string;
  url: string;
};

export const useCollection = ({ leadId }: { leadId: string }) => {
  const {
    data: collectionData,
    error: collectionDataError,
    mutate: revalidateCollectionData,
    isLoading: isFetchingCollectionData,
  } = useSWR<collectionDataType[]>(`/collection/get/${leadId}`, fetcher);

  return {
    collectionData,
    collectionDataError,
    revalidateCollectionData,
    isFetchingCollectionData,
  };
};

export const useFetchCreditCollections = ({
  pageNumber = 1,
  collectionStatus,
  searchTerm,
}: {
  pageNumber: number;
  collectionStatus: string;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch: string = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const url = `/collection/get-all?limit=${limit}&offset=${offset}&collectionStatus=${collectionStatus}`;

  const {
    data: allCollections,
    error: fetchCollectionsError,
    mutate: revalidateCollections,
    isLoading: isFetchingCollections,
  } = useSWR<CollectionApiDatatype>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    allCollections,
    fetchCollectionsError,
    revalidateCollections,
    isFetchingCollections,
  };
};

export const useCollectionTimeline = ({ leadId }: { leadId: string }) => {
  const {
    data: collectionTimelineData,
    error: fetchCollectionTimelineDataError,
    mutate: revalidateCollectionTimelineData,
    isLoading: isFetchingCollectionTimelineData,
  } = useSWR<CollectionTimelineType[]>(
    `/collection-timeline/get/${leadId}`,
    fetcher,
  );

  return {
    collectionTimelineData,
    fetchCollectionTimelineDataError,
    revalidateCollectionTimelineData,
    isFetchingCollectionTimelineData,
  };
};

export const useFetchWaiverRequests = ({
  pageNumber = 1,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const debouncedSearch: string = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const url = `/collection/get-waiver-requests?limit=${limit}&offset=${offset}`;

  const {
    data: allWaiverRequests,
    error: fetchWaiverRequestsError,
    mutate: revalidateWaiverRequests,
    isLoading: isFetchingWaiverRequests,
  } = useSWR<AllWaiverRequests>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    allWaiverRequests,
    fetchWaiverRequestsError,
    revalidateWaiverRequests,
    isFetchingWaiverRequests,
  };
};

export const useFetchAllCollections = ({
  pageNumber = 1,
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
  const debouncedSearch: string = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  let url = `/collection/get-master-collection?limit=${limit}&offset=${offset}`;

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }
  const {
    data: allCollections,
    error: fetchCollectionsError,
    mutate: revalidateCollections,
    isLoading: isFetchingCollections,
  } = useSWR<AllCollections>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    allCollections,
    fetchCollectionsError,
    revalidateCollections,
    isFetchingCollections,
  };
};

export const useFetchExtensionAmount = ({ leadId }: { leadId: string }) => {
  const {
    data: extensionAmount,
    error: fetchExtensionAmountError,
    mutate: revalidateExtensionAmount,
    isLoading: isFetchingExtensionAmount,
  } = useSWR<ExtensionAmount>(
    `/collection/get-extension-amount/${leadId}`,
    fetcher,
  );

  return {
    extensionAmount,
    fetchExtensionAmountError,
    revalidateExtensionAmount,
    isFetchingExtensionAmount,
  };
};

export const useFetchCollectionDocument = ({ leadId }: { leadId: string }) => {
  const {
    data: collectionDocument,
    error: fetchCollectionDocumentError,
    mutate: revalidateCollectionDocument,
    isLoading: isFetchingCollectionDocument,
  } = useSWR<CollectionDocumentType[]>(
    `/collection/get-collection-document/${leadId}`,
    fetcher,
  );

  return {
    collectionDocument,
    fetchCollectionDocumentError,
    revalidateCollectionDocument,
    isFetchingCollectionDocument,
  };
};
