import { useFetchCustomerSupportTicket } from '@/hooks/tickets-api';
import { enumCleaner, ticketStatus } from '@/utils/utils';
import { Card, Badge, Title } from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { TbEdit } from 'react-icons/tb';
import ModalContainer from '../modal';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputSelect from '../input-select';
import PrimaryCTA from '../primary-cta';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/network/axiosInstance';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';

type TicketStatusUpdateForm = {
  status: string;
};

type TicketPriorityUpdateForm = {
  priority: string;
};

type TicketAssignedToUpdateForm = {
  assignedTo: string;
};

const TicketStatusValidationSchema = yup.object({
  status: yup.string().required('Status required'),
});

const TicketPriorityValidationSchema = yup.object({
  priority: yup.string().required('Priority required'),
});

const TicketAssignedToValidationSchema = yup.object({
  assignedTo: yup.string().required('Assigned To required'),
});

const TicketDetails = ({ ticketId }: { ticketId: string }) => {
  const [loading, setLoading] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [assignedToOpen, setAssignedToOpen] = useState(false);

  const {
    customerSupportTicketData,
    revalidateCustomerSupportTicketData,
    isFetchingCustomerSupportTicketData,
  } = useFetchCustomerSupportTicket({ ticketId });

  const { usersByRoleAndBranchData, isFetchingUsersByRoleAndBranch } =
    useFetchUsersByRoleAndBranch({
      role: 'Service',
      branch: '',
    });

  const {
    control: statusControl,
    handleSubmit: statusHandleSubmit,
    formState: { errors: statusErrors },
  } = useForm<TicketStatusUpdateForm>({
    resolver: yupResolver(TicketStatusValidationSchema),
  });

  const {
    control: priorityControl,
    handleSubmit: priorityHandleSubmit,
    formState: { errors: priorityErrors },
  } = useForm<TicketPriorityUpdateForm>({
    resolver: yupResolver(TicketPriorityValidationSchema),
  });

  const {
    control: assignedToControl,
    handleSubmit: assignedToHandleSubmit,
    formState: { errors: assignedToErrors },
  } = useForm<TicketAssignedToUpdateForm>({
    resolver: yupResolver(TicketAssignedToValidationSchema),
  });

  const onSubmitStatus = async (data: TicketStatusUpdateForm) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/customer-support/update-ticket/${ticketId}`, {
        status: data.status,
      });
      toast.success('Status updated successfully');
      revalidateCustomerSupportTicketData();
      setStatusOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update status');
    }
  };

  const onSubmitPriority = async (data: TicketPriorityUpdateForm) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/customer-support/update-ticket/${ticketId}`, {
        priority: data.priority,
      });
      toast.success('Priority updated successfully');
      revalidateCustomerSupportTicketData();
      setPriorityOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update priority');
    }
  };

  const onSubmitAssignedTo = async (data: TicketAssignedToUpdateForm) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/customer-support/update-ticket/${ticketId}`, {
        assignedTo: data.assignedTo,
      });
      toast.success('Assigned To updated successfully');
      revalidateCustomerSupportTicketData();
      setAssignedToOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update assigned to!');
    }
  };

  if (isFetchingCustomerSupportTicketData || isFetchingUsersByRoleAndBranch) {
    return (
      <Card>
        <p className="text-tremor-title font-semibold">Ticket</p>
        <div className="grid-cols-3 grid mt-6 animate-pulse">
          {Array.from({ length: 12 }, (_, index) => (
            <div className="my-2 flex-col flex" key={index}>
              <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      {' '}
      <Card>
        <p className="text-tremor-title font-semibold">
          Ticket {customerSupportTicketData?.ticketNumber}
        </p>
        <div className="grid-cols-3 grid mt-6">
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Created By
            </span>
            <span className="text-sm font-medium">
              {customerSupportTicketData?.createdBy}
            </span>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Monthly Income
            </span>
            <span className="text-sm font-medium">
              {customerSupportTicketData?.category}
            </span>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Query
            </span>
            <span className="text-sm font-medium">
              {customerSupportTicketData?.query}
            </span>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Status
            </span>
            <div className="flex flex-row items-center text-sm font-medium">
              <Badge
                color={ticketStatus(customerSupportTicketData?.status || '')}>
                {enumCleaner(customerSupportTicketData?.status || '')}
              </Badge>
              <TbEdit
                className="ml-2 cursor-pointer"
                onClick={() => setStatusOpen(true)}
              />
            </div>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Priority
            </span>
            <div className="flex flex-row items-center text-sm font-medium">
              <Badge
                color={
                  customerSupportTicketData?.priority === 'Low'
                    ? 'green'
                    : customerSupportTicketData?.priority === 'Medium'
                    ? 'yellow'
                    : customerSupportTicketData?.priority === 'High'
                    ? 'red'
                    : 'purple'
                }>
                {customerSupportTicketData?.priority}
              </Badge>
              <TbEdit
                className="ml-2 cursor-pointer"
                onClick={() => setPriorityOpen(true)}
              />
            </div>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Assigned To
            </span>
            <div className="flex flex-row items-center text-sm font-medium">
              {customerSupportTicketData?.assignedTo}
              <TbEdit
                className="ml-2 cursor-pointer"
                onClick={() => setAssignedToOpen(true)}
              />
            </div>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Created At
            </span>
            <span className="text-sm font-medium">
              {format(
                parseISO(customerSupportTicketData?.createdAt || ''),
                'dd-MM-yyyy hh:mm:ss',
              )}
            </span>
          </div>
          <div className="my-2 flex-col flex">
            <span className="text-xs font-medium text-gray-400 mb-1">
              Updated At
            </span>
            <span className="text-sm font-medium">
              {format(
                parseISO(customerSupportTicketData?.updatedAt || ''),
                'dd-MM-yyyy hh:mm:ss',
              )}
            </span>
          </div>
        </div>
      </Card>
      <ModalContainer
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        styles="bg-white">
        <Card className="mt-2 md:mt-0 shadow-md">
          <Title>Change status</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="status"
              control={statusControl}
              defaultValue={customerSupportTicketData?.status}
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Set Status"
                  value={value}
                  onChange={onChange}
                  options={[
                    {
                      key: '1',
                      label: 'Open',
                      value: 'Open',
                    },
                    {
                      key: '2',
                      label: 'In Progress',
                      value: 'In_Progress',
                    },
                    {
                      key: '3',
                      label: 'Resolved',
                      value: 'Resolved',
                    },
                    {
                      key: '4',
                      label: 'Closed',
                      value: 'Closed',
                    },
                  ]}
                  errorMessage={statusErrors.status?.message}
                  disabled={!!loading}
                />
              )}
            />
          </div>
          <div className="w-full flex justify-end">
            <PrimaryCTA
              ctaText="Submit"
              loading={loading}
              disabled={!!loading}
              onClick={statusHandleSubmit(onSubmitStatus)}
            />
          </div>
        </Card>
      </ModalContainer>
      <ModalContainer
        isOpen={assignedToOpen}
        onClose={() => setAssignedToOpen(false)}
        styles="bg-white">
        <Card className="mt-2 md:mt-0 shadow-md">
          <Title>Change Assigned To</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="assignedTo"
              control={assignedToControl}
              defaultValue={customerSupportTicketData?.priority}
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Set Assigned To"
                  value={value}
                  onChange={onChange}
                  options={usersByRoleAndBranchData || []}
                  errorMessage={assignedToErrors.assignedTo?.message}
                  disabled={!!loading}
                />
              )}
            />
          </div>
          <div className="w-full flex justify-end">
            <PrimaryCTA
              ctaText="Submit"
              loading={loading}
              disabled={!!loading}
              onClick={assignedToHandleSubmit(onSubmitAssignedTo)}
            />
          </div>
        </Card>
      </ModalContainer>
      <ModalContainer
        isOpen={priorityOpen}
        onClose={() => setPriorityOpen(false)}
        styles="bg-white">
        <Card className="mt-2 md:mt-0 shadow-md">
          <Title>Change Priority</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="priority"
              control={priorityControl}
              defaultValue={customerSupportTicketData?.priority}
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Set Status"
                  value={value}
                  onChange={onChange}
                  options={[
                    {
                      key: '1',
                      label: 'Low',
                      value: 'Low',
                    },
                    {
                      key: '2',
                      label: 'Medium',
                      value: 'Medium',
                    },
                    {
                      key: '3',
                      label: 'High',
                      value: 'High',
                    },
                    {
                      key: '4',
                      label: 'Super',
                      value: 'Super',
                    },
                  ]}
                  errorMessage={priorityErrors.priority?.message}
                  disabled={!!loading}
                />
              )}
            />
          </div>
          <div className="w-full flex justify-end">
            <PrimaryCTA
              ctaText="Submit"
              loading={loading}
              disabled={!!loading}
              onClick={priorityHandleSubmit(onSubmitPriority)}
            />
          </div>
        </Card>
      </ModalContainer>
    </>
  );
};

export default TicketDetails;
