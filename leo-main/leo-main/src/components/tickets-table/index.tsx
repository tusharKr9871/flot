import { Dispatch, SetStateAction, useState } from 'react';
import NoTableDataFound from '../no-table-data-found';
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import classNames from 'classnames';
import Pagination from '../pagination';
import {
  SupportTicketType,
  useFetchCustomerSupportTickets,
} from '@/hooks/tickets-api';
import { enumCleaner, ticketStatus } from '@/utils/utils';
import Link from 'next/link';
import { TbEdit, TbEye } from 'react-icons/tb';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import InputSelect from '../input-select';
import ModalContainer from '../modal';
import PrimaryCTA from '../primary-cta';
import { useFetchUsersByRoleAndBranch } from '@/hooks/user-api';
import * as yup from 'yup';

type EditTicketFormType = {
  status: string;
  priority: string;
  assignedTo: string;
};

export const EditTicketValidationSchema = yup.object({
  status: yup.string().required('Status required'),
  priority: yup.string().required('Priority required'),
  assignedTo: yup.string().required('Assigned To required'),
});

const TicketsTable = ({
  tableData,
  totalTickets,
  pageNumber,
  setPageNumber,
}: {
  tableData: SupportTicketType[];
  totalTickets: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<SupportTicketType>();
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const { revalidateCustomerSupportTicketData } =
    useFetchCustomerSupportTickets({
      pageNumber,
    });

  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role: 'Service',
    branch: '',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTicketFormType>({
    resolver: yupResolver(EditTicketValidationSchema),
  });

  const onSubmit = async (data: EditTicketFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/customer-support/update-ticket/${ticket?.id}`, {
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
      });
      toast.success('Ticket updated successfully');
      revalidateCustomerSupportTicketData();
      setEditTicketOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update ticket!');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="h-[90%] mt-4">
        <TableHead>
          <TableRow className="bg-white border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Ticket No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Query</TableHeaderCell>
            <TableHeaderCell className="bg-white">Category</TableHeaderCell>
            <TableHeaderCell className="bg-white">Created By</TableHeaderCell>
            <TableHeaderCell className="bg-white">Assigned To</TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Priority</TableHeaderCell>
            <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
            <TableHeaderCell className="bg-white">Updated At</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell>
                <Link
                  className="text-2xl cursor-pointer text-primaryColor"
                  href={`/service/support_tickets/${item.id}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>
                <TbEdit
                  className="ml-2 cursor-pointer text-xl text-primaryColor"
                  onClick={() => {
                    setEditTicketOpen(true);
                    setTicket(item);
                  }}
                />
              </TableCell>
              <TableCell>{item.ticketNumber}</TableCell>
              <TableCell>{item.query}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.createdBy}</TableCell>
              <TableCell className="flex flex-row items-center">
                {item.assignedTo}
              </TableCell>
              <TableCell>
                <Badge color={ticketStatus(item.status)}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  color={
                    item.priority === 'Low'
                      ? 'green'
                      : item.priority === 'Medium'
                      ? 'yellow'
                      : item.priority === 'High'
                      ? 'red'
                      : 'purple'
                  }>
                  {item.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.updatedAt), 'dd-MM-yyyy hh:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalTickets / 10) === 0
              ? 1
              : Math.ceil(totalTickets / 10)
          }
          totalItems={totalTickets}
          onPageChange={handlePageChange}
        />
      </div>
      <ModalContainer
        isOpen={editTicketOpen}
        onClose={() => setEditTicketOpen(false)}
        styles="bg-white">
        <Card className="mt-2 md:mt-0 shadow-md">
          <Title>Edit Ticket</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="status"
              control={control}
              defaultValue={ticket?.status}
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
                  errorMessage={errors.status?.message}
                  disabled={!!loading}
                />
              )}
            />
            <Controller
              name="priority"
              control={control}
              defaultValue={ticket?.priority}
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
                  errorMessage={errors.priority?.message}
                  disabled={!!loading}
                />
              )}
            />
            <Controller
              name="assignedTo"
              control={control}
              defaultValue={ticket?.assignedTo || ''}
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Set Assigned To"
                  value={value}
                  onChange={onChange}
                  options={usersByRoleAndBranchData || []}
                  errorMessage={errors.assignedTo?.message}
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
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </Card>
      </ModalContainer>
    </>
  );
};

export default TicketsTable;
