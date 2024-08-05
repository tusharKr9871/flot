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
import NoTableDataFound from '../no-table-data-found';
import { AuditLogsType } from '@/hooks/audit-logs-api';
import { enumCleaner, selectEventTypeColor } from '@/utils/utils';
import classNames from 'classnames';

const AuditLogsTable = ({
  tableData,
  total,
  pageNumber,
  setPageNumber,
}: {
  tableData: AuditLogsType[];
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
            <TableHeaderCell className="bg-white">User</TableHeaderCell>
            <TableHeaderCell className="bg-white">Activity</TableHeaderCell>
            <TableHeaderCell className="bg-white">Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell>
                <p className="text-black">{item.userName}</p>
                <p>{enumCleaner(item.userRole)}</p>
              </TableCell>
              <TableCell>{item.activity}</TableCell>
              <TableCell>
                <Badge color={selectEventTypeColor(item.eventType)}>
                  {item.eventType}
                </Badge>
              </TableCell>
              <TableCell>
                <p>{format(parseISO(item.createdAt), 'dd-MM-yyyy')}</p>
                <p>{format(parseISO(item.createdAt), 'hh:mm')}</p>
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

export default AuditLogsTable;
