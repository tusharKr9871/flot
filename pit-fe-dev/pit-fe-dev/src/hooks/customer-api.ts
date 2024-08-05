import useSWR from "swr";
import { fetcher } from "./fetcher";
import useSWRImmutable from "swr/immutable";

export type CustomerDataType = {
  id: string;
  customerName: string;
  customerPicture: string;
  email: string;
  phoneNo: string;
  gender: string;
  createdAt: string;
  pan: string;
  aadhar: string;
  dob: string;
  city: string;
  status: string;
};

type CustomerApplicationDataType = {
  id: string;
  status: string;
  stepsCompleted: number;
  loanAmountRequired: string;
  repayDate: string;
  repaymentAmount: number;
  repayAmountTillNow: number;
  approvalAmount: number;
  purpose: string;
} | null;

type CustomerDocumentDataType = {
  id: string;
  documentType: string;
  documentUrl: string;
  password: string;
  status: string;
};

type CustomerApplicationHistoryDataType = CustomerApplicationDataType & {
  loanNo: string;
  approvedAmount: number;
  repaymentAmount: number;
  repaymentDate: string;
  collectedAmount: number;
  createdAt: string;
};

type ReapplyData = {
  email: string;
  monthlyIncome: string;
  loanAmountRequired: string;
  purpose: string;
  state: string;
  city: string;
  pincode: string;
  latestLeadStatus: string;
};

export const useFetchCustomer = ({ userToken }: { userToken: string }) => {
  // const userToken =
  //   typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
  const {
    data: customerData,
    error: fetchCustomerDataError,
    mutate: revalidateCustomerData,
    isLoading: isFetchingCustomerData,
  } = useSWR<CustomerDataType>(
    userToken ? "/customer/customer-details" : null,
    fetcher
  );

  return {
    customerData,
    fetchCustomerDataError,
    revalidateCustomerData,
    isFetchingCustomerData,
  };
};

export const useFetchCustomerApplicationDetails = () => {
  const {
    data: customerApplicationData,
    error: fetchCustomerApplicationDataError,
    mutate: revalidateCustomerApplicationData,
    isLoading: isFetchingCustomerApplicationData,
  } = useSWR<CustomerApplicationDataType>(
    "/customer/application-details",
    fetcher
  );

  return {
    customerApplicationData,
    fetchCustomerApplicationDataError,
    revalidateCustomerApplicationData,
    isFetchingCustomerApplicationData,
  };
};

export const useFetchCustomerDocuments = () => {
  const {
    data: customerDocumentData,
    error: fetchCustomerDocumentDataError,
    mutate: revalidateCustomerDocumentData,
    isLoading: isFetchingCustomerDocumentData,
  } = useSWR<CustomerDocumentDataType[]>("/customer/get-documents", fetcher);

  return {
    customerDocumentData,
    fetchCustomerDocumentDataError,
    revalidateCustomerDocumentData,
    isFetchingCustomerDocumentData,
  };
};

export const useFetchCustomerApplicationHistory = () => {
  const {
    data: customerApplicationHistoryData,
    error: fetchCustomerApplicationHistoryDataError,
    mutate: revalidateCustomerApplicationHistoryData,
    isLoading: isFetchingCustomerApplicationHistoryData,
  } = useSWR<CustomerApplicationHistoryDataType[]>(
    "/customer/get-application-history",
    fetcher
  );

  return {
    customerApplicationHistoryData,
    fetchCustomerApplicationHistoryDataError,
    revalidateCustomerApplicationHistoryData,
    isFetchingCustomerApplicationHistoryData,
  };
};

export const useFetchReapplyData = () => {
  const {
    data: reapplyData,
    error: fetchReapplyDataError,
    isLoading: isFetchingReapplyData,
    mutate: revalidateReapplyData,
  } = useSWRImmutable<ReapplyData>(
    `/customer/get-reapply-data?clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
    fetcher
  );

  return {
    reapplyData,
    fetchReapplyDataError,
    isFetchingReapplyData,
    revalidateReapplyData,
  };
};
