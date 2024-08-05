'use client';

import TableLoader from '@/components/table-loader';
import { useLoanHistory } from '@/hooks/loan-api';
import {
  enumCleaner,
  formatIndianNumber,
  selectPillColor,
} from '@/utils/utils';
import {
  Badge,
  Card,
  Metric,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import Link from 'next/link';
import { TbEye } from 'react-icons/tb';
import classNames from 'classnames';

const LoanHistory = ({ leadId }: { leadId: string }) => {
  const { loanHistoryData, isFetchingLoanHistoryData } = useLoanHistory({
    leadId,
  });

  if (isFetchingLoanHistoryData) {
    return (
      <Card>
        <TableLoader />
      </Card>
    );
  }

  return (
    <Card>
      {loanHistoryData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-48">
          <Metric className="text-3xl font-semibold text-gray-400">
            No Loan History found!
          </Metric>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="bg-white"></TableHeaderCell>
              <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Loan Amount
              </TableHeaderCell>
              <TableHeaderCell className="bg-white">ROI</TableHeaderCell>
              <TableHeaderCell className="bg-white">Days</TableHeaderCell>
              <TableHeaderCell className="bg-white">Repay Date</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Collection Date
              </TableHeaderCell>
              <TableHeaderCell className="bg-white">DPD</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Credited By
              </TableHeaderCell>
              <TableHeaderCell className="bg-white">Status</TableHeaderCell>
              <TableHeaderCell className="bg-white">
                Collection Remark
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-slate-600">
            {loanHistoryData?.map((item, index) => (
              <TableRow
                key={item.loanNo}
                className={classNames(index % 2 === 0 && 'bg-gray-100')}>
                <TableCell>
                  <Link
                    href={`/customer_profile/${item.leadId}`}
                    className="text-2xl cursor-pointer text-primaryColor"
                    target="_blank">
                    <TbEye />
                  </Link>
                </TableCell>
                <TableCell>{item.loanNo}</TableCell>
                <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
                <TableCell>{item.roi}%</TableCell>
                <TableCell>{item.days}</TableCell>
                <TableCell>
                  {format(parseISO(item.repayDate), 'dd-MM-yyyy')}
                </TableCell>
                <TableCell>
                  {item.collectionDate.length !== 0
                    ? format(parseISO(item.collectionDate), 'dd-MM-yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {item.collectionDate.length !== 0
                    ? differenceInCalendarDays(
                        parseISO(item.collectionDate),
                        parseISO(item.repayDate),
                      ) >= 0
                      ? differenceInCalendarDays(
                          parseISO(item.collectionDate),
                          parseISO(item.repayDate),
                        )
                      : 'N/A'
                    : 'N/A'}
                </TableCell>
                <TableCell>{item.credit}</TableCell>
                <TableCell>
                  <Badge color={selectPillColor(enumCleaner(item.status))}>
                    {enumCleaner(item.status)}
                  </Badge>
                </TableCell>
                <TableCell>{item.collectionRemark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default LoanHistory;
