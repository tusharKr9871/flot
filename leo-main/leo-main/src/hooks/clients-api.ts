import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from './fetcher';
import { Option } from '@/components/input-select';

type ClientsDataType = {
  clientId: string;
  logo: string;
  name: string;
};

type ClientDataType = ClientsDataType & {
  loanType: string;
};

type ClientBankAccountType = {
  clientBankAccounts: Option[];
};

type accountsType = Option & {
  provider: string;
};

type ClientAutoDisbursalEnabled = {
  status: boolean;
  accounts: accountsType[];
};

export const useClients = () => {
  const {
    data: clientsData,
    error: fetchClientsDataError,
    mutate: revalidateClientsData,
    isLoading: isFetchingClientsData,
  } = useSWR<ClientsDataType[]>(`/clients/get-clients`, fetcher);

  return {
    clientsData,
    fetchClientsDataError,
    revalidateClientsData,
    isFetchingClientsData,
  };
};

export const useFetchClient = () => {
  const {
    data: clientData,
    error: fetchClientDataError,
    mutate: revalidateClientData,
    isLoading: isFetchingClientData,
  } = useSWR<ClientDataType>('/clients/get-client-details', fetcher);

  return {
    clientData,
    fetchClientDataError,
    revalidateClientData,
    isFetchingClientData,
  };
};

export const useClientBankAccount = () => {
  const {
    data: clientBankAccounts,
    error: fetchClientBankAccountsError,
    mutate: revalidateClientBankAccounts,
    isLoading: isFetchingClientBankAccounts,
  } = useSWR<ClientBankAccountType>(
    `/clients/get-client-bank-accounts`,
    fetcher,
  );

  return {
    clientBankAccounts,
    fetchClientBankAccountsError,
    revalidateClientBankAccounts,
    isFetchingClientBankAccounts,
  };
};

export const useClientAutoDisbursalEnabled = () => {
  const {
    data: clientAutoDisbursalEnabled,
    error: fetchClientAutoDisbursalEnabledError,
    mutate: revalidateClientAutoDisbursalEnabled,
    isLoading: isFetchingClientAutoDisbursalEnabled,
  } = useSWRImmutable<ClientAutoDisbursalEnabled>(
    `/clients/auto-disbursal-enabled`,
    fetcher,
  );

  return {
    clientAutoDisbursalEnabled,
    fetchClientAutoDisbursalEnabledError,
    revalidateClientAutoDisbursalEnabled,
    isFetchingClientAutoDisbursalEnabled,
  };
};
