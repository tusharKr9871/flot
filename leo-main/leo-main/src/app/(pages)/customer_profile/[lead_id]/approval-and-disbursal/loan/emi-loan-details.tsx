'use client';

import { useFetchLead } from '@/hooks/leads-api';
import { useGetEMILoan, useLoanData } from '@/hooks/loan-api';
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
import { format, parseISO } from 'date-fns';

const EMILoanDetails = ({ leadId }: { leadId: string }) => {
  const { loanData, isFetchingLoanData } = useLoanData({ leadId });
  const { leadData, isFetchingLead } = useFetchLead({ leadId });
  const { emiLoanData, isFetchingEMILoanData } = useGetEMILoan({ leadId });

  if (isFetchingLoanData || isFetchingLead || isFetchingEMILoanData) {
    return (
      <Card>
        <p className="text-tremor-title font-semibold">Loan Details</p>
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
      <Card className="mt-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-tremor-title font-semibold">Loan Details</p>
        </div>
        {!loanData ? (
          <div className="flex flex-col items-center justify-center w-full h-48">
            <Metric className="text-3xl font-semibold text-gray-400">
              No Loan Data Found!
            </Metric>
          </div>
        ) : (
          <>
            {leadData?.status === 'Part_Payment' && (
              <div>
                <p className="text-tremor-title font-semibold">
                  This is part payment case, request you to{' '}
                  <span className="text-red-500">VERIFY THE CALCULATIONS</span>
                </p>
              </div>
            )}

            <div className="grid-cols-3 grid mt-6">
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Disbursal Amount
                </span>
                <span className="text-sm font-medium">
                  {formatIndianNumber(loanData.loanDisbursed)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  ROI
                </span>
                <span className="text-sm font-medium">{loanData.roi}%</span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  No. of Months
                </span>
                <span className="text-sm font-medium">{loanData.noOfDays}</span>
              </div>
            </div>
            <Table>
              <TableHead>
                <TableRow className="bg-white border-b-2">
                  <TableHeaderCell className="bg-white"></TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    EMI Amount
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">
                    Payment Date
                  </TableHeaderCell>
                  <TableHeaderCell className="bg-white">Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emiLoanData?.map(emi => (
                  <TableRow key={emi.emiId}>
                    <TableCell></TableCell>
                    <TableCell>{formatIndianNumber(emi.emiAmount)}</TableCell>
                    <TableCell>
                      {format(parseISO(emi.emiDate), 'dd-MM-yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge color={selectPillColor(emi.emiStatus)}>
                        {enumCleaner(emi.emiStatus)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Card>
    </>
  );
};

export default EMILoanDetails;
