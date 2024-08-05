'use client';

import TableLoader from '@/components/table-loader';
import { useFetchLeadHistory } from '@/hooks/leads-api';
import { enumCleaner, selectPillColor } from '@/utils/utils';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Card,
  Metric,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { TbEye } from 'react-icons/tb';
import classNames from 'classnames';

const LeadHistory = ({ leadId }: { leadId: string }) => {
  const { leadHistoryData, isFetchingLeadHistory } = useFetchLeadHistory({
    leadId,
  });

  if (isFetchingLeadHistory) {
    return (
      <Card>
        <TableLoader />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      {leadHistoryData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-48">
          <Metric className="text-3xl font-semibold text-gray-400">
            No Lead History found!
          </Metric>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="bg-white"></TableHeaderCell>
              <TableHeaderCell className="bg-white">Purpose</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Required Amount
              </TableHeaderCell>
              <TableHeaderCell className="bg-white">Tenure</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Monthly Income
              </TableHeaderCell>
              <TableHeaderCell className="bg-white">City</TableHeaderCell>
              <TableHeaderCell className="bg-white">State</TableHeaderCell>
              <TableHeaderCell className="bg-white">Pincode</TableHeaderCell>
              <TableHeaderCell className="bg-white">Status</TableHeaderCell>
              <TableHeaderCell className="bg-white">Source</TableHeaderCell>
              <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
              <TableHeaderCell className="bg-white"></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-slate-600">
            {leadHistoryData?.map((item, index) => (
              <TableRow
                key={item.id}
                className={classNames(index % 2 === 0 && 'bg-gray-100')}>
                <TableCell>
                  <Link
                    className="text-2xl cursor-pointer text-primaryColor"
                    href={`/customer_profile/${item.id}`}
                    target="_blank">
                    <TbEye />
                  </Link>
                </TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.requiredAmount}</TableCell>
                <TableCell>{item.tenure}</TableCell>
                <TableCell>{item.monthlyIncome}</TableCell>
                <TableCell>{item.city}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell>{item.pincode}</TableCell>
                <TableCell>
                  <Badge color={selectPillColor(enumCleaner(item.status))}>
                    {enumCleaner(item.status)}
                  </Badge>
                </TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>
                  {format(parseISO(item.createdAt), 'dd-MM-yyyy hh:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default LeadHistory;
