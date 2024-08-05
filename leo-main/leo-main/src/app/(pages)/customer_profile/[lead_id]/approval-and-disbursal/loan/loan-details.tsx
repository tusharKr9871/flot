'use client';

import { useFetchLead } from '@/hooks/leads-api';
import { useLoanData } from '@/hooks/loan-api';
import { formatIndianNumber } from '@/utils/utils';
import { Card, Metric } from '@tremor/react';
import { format, parseISO } from 'date-fns';

const LoanDetails = ({ leadId }: { leadId: string }) => {
  const { loanData, isFetchingLoanData } = useLoanData({ leadId });
  const { leadData, isFetchingLead } = useFetchLead({ leadId });

  if (isFetchingLoanData || isFetchingLead) {
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
                  Branch
                </span>
                <span className="text-sm font-medium">{loanData.branch}</span>
              </div>
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
                  No. of Days
                </span>
                <span className="text-sm font-medium">{loanData.noOfDays}</span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Real Days
                </span>
                <span className="text-sm font-medium">{loanData.realDays}</span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Days Past Due
                </span>
                <span className="text-sm font-medium text-red-600">
                  {loanData.penaltyDays}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Current Interest
                </span>
                <span className="text-sm font-medium">
                  {formatIndianNumber(loanData.totalInterest)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Current Penalty Interest
                </span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianNumber(loanData.penaltyInterest)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Bouncing Charges
                </span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianNumber(loanData.bouncingCharges)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Paid Amount
                </span>
                <span className="text-sm font-medium text-green-400">
                  {formatIndianNumber(loanData.paidAmount)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Original Repayment Amount
                </span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianNumber(loanData.repaymentAmount)}
                </span>
              </div>
              <div className="my-2 flex-col flex">
                <span className="text-xs font-medium text-gray-400 mb-1">
                  Repayment Amount till{' '}
                  {format(parseISO(loanData.currentDate), 'dd-MM-yyyy')}
                </span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianNumber(loanData.currentRepayAmount)}
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default LoanDetails;
