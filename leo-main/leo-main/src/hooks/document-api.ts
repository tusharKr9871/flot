import useSWR from 'swr';
import { fetcher } from './fetcher';

type DocumentDataType = {
  id: string;
  documentType: string;
  documentUrl: string;
  password: string;
  status: string;
  verifiedBy: string;
  verifiedDate: string;
  uploadedBy: string;
  uploadDate: string;
  isArchived: boolean;
};

export const useDocument = ({ leadId }: { leadId: string }) => {
  const {
    data: customerDocumentData,
    error: fetchDocumentError,
    mutate: revalidateDocumentData,
    isLoading: isFetchingDocumentData,
  } = useSWR<DocumentDataType[]>(`/documents/get/${leadId}`, fetcher);

  return {
    customerDocumentData,
    fetchDocumentError,
    revalidateDocumentData,
    isFetchingDocumentData,
  };
};
