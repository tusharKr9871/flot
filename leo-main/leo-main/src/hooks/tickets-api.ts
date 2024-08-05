import useSWR from 'swr';
import { fetcher } from './fetcher';
import { format } from 'date-fns';

export type SupportTicketType = {
  id: string;
  ticketNumber: string;
  query: string;
  category: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketAPIType = {
  tickets: SupportTicketType[];
  ticketCount: number;
};

type SupportTicketChatType = {
  id: string;
  message: string;
  createdBy: string;
  createdAt: string;
};

export const useFetchCustomerSupportTickets = ({
  pageNumber = 1,
  filterBy,
  startDate,
  endDate,
}: {
  pageNumber: number;
  filterBy?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  let url: string;
  if (filterBy) {
    url = `/customer-support/get-all-tickets?limit=${limit}&offset=${offset}&filter=${filterBy}`;
  } else {
    url = `/customer-support/get-all-tickets?limit=${limit}&offset=${offset}`;
  }

  if (startDate && endDate) {
    url += `&startDate=${format(startDate, 'dd-MM-yyyy')}&endDate=${format(
      endDate,
      'dd-MM-yyyy',
    )}`;
  }

  const {
    data: customerSupportTicketData,
    error: fetchCustomerSupportTicketDataError,
    mutate: revalidateCustomerSupportTicketData,
    isLoading: isFetchingCustomerSupportTicketData,
  } = useSWR<SupportTicketAPIType>(url, fetcher);

  return {
    customerSupportTicketData,
    fetchCustomerSupportTicketDataError,
    revalidateCustomerSupportTicketData,
    isFetchingCustomerSupportTicketData,
  };
};

export const useFetchCustomerSupportTicket = ({
  ticketId,
}: {
  ticketId: string;
}) => {
  const {
    data: customerSupportTicketData,
    error: fetchCustomerSupportTicketDataError,
    mutate: revalidateCustomerSupportTicketData,
    isLoading: isFetchingCustomerSupportTicketData,
  } = useSWR<SupportTicketType>(
    `/customer-support/get-ticket/${ticketId}`,
    fetcher,
  );

  return {
    customerSupportTicketData,
    fetchCustomerSupportTicketDataError,
    revalidateCustomerSupportTicketData,
    isFetchingCustomerSupportTicketData,
  };
};

export const useFetchCustomerSupportTicketChat = ({
  ticketId,
}: {
  ticketId: string;
}) => {
  const {
    data: customerSupportTicketChatData,
    error: fetchCustomerSupportTicketChatDataError,
    mutate: revalidateCustomerSupportTicketChatData,
    isLoading: isFetchingCustomerSupportTicketChatData,
  } = useSWR<SupportTicketChatType[]>(
    `/customer-support/get-ticket-chat/${ticketId}`,
    fetcher,
  );

  return {
    customerSupportTicketChatData,
    fetchCustomerSupportTicketChatDataError,
    revalidateCustomerSupportTicketChatData,
    isFetchingCustomerSupportTicketChatData,
  };
};
