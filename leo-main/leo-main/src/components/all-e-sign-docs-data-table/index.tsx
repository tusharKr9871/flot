import { AllESignDocsType } from '@/hooks/kyc-api';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import Pagination from '../pagination';
import { TbEye } from 'react-icons/tb';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import classNames from 'classnames';

const AllESignDocsTable = ({
  tableData,
  total,
  pageNumber,
  setPageNumber,
}: {
  tableData: AllESignDocsType[];
  total: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="mt-4 h-full">
        <TableHead>
          <TableRow className="border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white">Request Id</TableHeaderCell>
            <TableHeaderCell className="bg-white">Filename</TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Requested By</TableHeaderCell>
            <TableHeaderCell className="bg-white">Request Date</TableHeaderCell>
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
                  href={`/customer_profile/${item.leadId}`}
                  target="_blank">
                  <TbEye />
                </Link>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.requestId}</TableCell>
              <TableCell>{item.fileName}</TableCell>
              <TableCell>
                <Badge
                  color={
                    item.status === 'requested'
                      ? 'yellow'
                      : item.status === 'completed'
                      ? 'green'
                      : 'red'
                  }>
                  {item.status === 'requested'
                    ? 'Requested'
                    : item.status === 'completed'
                    ? 'Signed'
                    : 'Expired'}
                </Badge>
              </TableCell>
              <TableCell>{item.requestedBy}</TableCell>
              <TableCell>
                {format(parseISO(item.requestDate), 'dd-MM-yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={Math.ceil(total / 10) === 0 ? 1 : Math.ceil(total / 10)}
          totalItems={total}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default AllESignDocsTable;
