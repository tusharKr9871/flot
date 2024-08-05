import useSWR from 'swr';
import { fetcher } from './fetcher';

export type CustomerAssetsFormType = {
  assetName: string;
  assetValue: string;
};

type CustomerAssetType = CustomerAssetsFormType & {
  id: string;
  updatedAt: string;
  createdAt: string;
};

export const useCustomerAssets = ({ leadId }: { leadId: string }) => {
  const {
    data: customerAssetsData,
    error: fetchCustomerAssetsError,
    mutate: revalidateCustomerAssets,
    isLoading: isFetchingCustomerAssets,
  } = useSWR<CustomerAssetType[]>(`/customer-asset/get/${leadId}`, fetcher);

  return {
    customerAssetsData,
    fetchCustomerAssetsError,
    revalidateCustomerAssets,
    isFetchingCustomerAssets,
  };
};
