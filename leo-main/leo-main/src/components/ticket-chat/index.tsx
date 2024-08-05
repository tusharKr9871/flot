import { Card, Metric, Title, Textarea } from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { TbUser } from 'react-icons/tb';
import PrimaryCTA from '../primary-cta';
import {
  useFetchCustomerSupportTicket,
  useFetchCustomerSupportTicketChat,
} from '@/hooks/tickets-api';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';

const validationSchema = yup.object({
  message: yup.string().required('Company Name required'),
});

const TicketChat = ({ ticketId }: { ticketId: string }) => {
  const [loading, setLoading] = useState(false);
  const { customerSupportTicketData, isFetchingCustomerSupportTicketData } =
    useFetchCustomerSupportTicket({ ticketId });
  const {
    customerSupportTicketChatData,
    revalidateCustomerSupportTicketChatData,
    isFetchingCustomerSupportTicketChatData,
  } = useFetchCustomerSupportTicketChat({ ticketId });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ message: string }>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: { message: string }) => {
    setLoading(true);
    try {
      await axiosInstance.post(`/customer-support/create-chat/${ticketId}`, {
        message: data.message,
      });
      toast.success('Message sent successfully');
      reset({
        message: '',
      });
      revalidateCustomerSupportTicketChatData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (
    isFetchingCustomerSupportTicketChatData ||
    isFetchingCustomerSupportTicketData
  ) {
    return (
      <Card>
        <div className="flex flex-col">
          <ol className="relative border-l border-gray-200">
            <li className="mb-10 ml-6 animate-pulse w-[90%]">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                <TbUser className="rounded-full shadow-lg" />
              </span>
              <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                  <div className="h-2.5 bg-gray-200 rounded-full w-8 mb-4"></div>
                </time>
                <div className="text-sm font-normal text-gray-500 flex flex-1 flex-col">
                  <div className="text-tremor-default font-semibold text-gray-900 mb-2">
                    <div className="h-2.5 bg-gray-200 rounded-full w-[90%] mb-4"></div>
                  </div>
                  <div className="flex flex-row items-center">
                    <span className="font-semibold text-gray-900 mr-1">
                      <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
                    </span>
                  </div>
                  <div className="p-3 mt-4 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 w-4/5">
                    <div className="h-2.5 bg-gray-200 rounded-full mb-4"></div>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </Card>
    );
  }

  return (
    <Card className="my-4">
      <Title className="pb-4">Ticket Chat</Title>
      <div className="flex flex-col">
        <div className="flex flex-row flex-1 justify-end mb-4"></div>
        <ol className="relative border-l border-gray-200">
          {customerSupportTicketChatData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Metric className="text-3xl font-semibold text-gray-400">
                No message history
              </Metric>
            </div>
          ) : (
            customerSupportTicketChatData?.map(chat => (
              <li className="mb-10 ml-6" key={chat.id}>
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -left-3 ring-8 ring-white">
                  <TbUser className="h-1/2 w-1/2" />
                </span>
                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                  <div className="text-sm font-normal text-gray-500 flex flex-1 flex-col">
                    <div className="text-tremor-default font-semibold text-gray-900 mb-2">
                      {format(parseISO(chat.createdAt), 'do MMMM yyyy')}
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-semibold text-gray-900 mr-1">
                        {chat.createdBy}
                      </span>
                    </div>
                    <div className="p-3 whitespace-pre mt-4 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 w-full">
                      {chat.message}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-end">
                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                      {format(parseISO(chat.createdAt), 'hh:mm:ss')}
                    </time>
                  </div>
                </div>
              </li>
            ))
          )}
        </ol>
        <div className="flex flex-row justify-between mt-10">
          <Card>
            <label
              htmlFor="description"
              className="text-tremor-default text-tremor-content font-semibold">
              Enter your message
            </label>
            <Controller
              control={control}
              name="message"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  onChange={e => onChange(e.target.value)}
                  id="description"
                  placeholder="Start typing here..."
                  rows={6}
                  className="mt-4"
                  value={value}
                  error={!!errors.message}
                  errorMessage={errors.message?.message}
                />
              )}
            />

            <div className="flex items-end mt-4">
              <PrimaryCTA
                ctaText="Send"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  customerSupportTicketData?.status === 'Closed' ||
                  customerSupportTicketData?.status === 'Resolved' ||
                  !!loading
                }
                loading={!!loading}
              />
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default TicketChat;
