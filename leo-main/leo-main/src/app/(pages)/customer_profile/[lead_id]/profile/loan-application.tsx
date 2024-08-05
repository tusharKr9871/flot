import { useFetchLead } from '@/hooks/leads-api';
import { enumCleaner, selectPillColor } from '@/utils/utils';
import { Card, Badge, Metric } from '@tremor/react';
import { format, parseISO } from 'date-fns';

const LoanApplicationDetails = ({ leadId }: { leadId: string }) => {
  const { leadData, isFetchingLead } = useFetchLead({ leadId });

  if (isFetchingLead) {
    return (
      <Card>
        <p className="text-tremor-title font-semibold">
          Loan Application Details
        </p>
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

  if (!leadData) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-48">
        <Metric className="text-3xl font-semibold text-gray-400">
          No Loan application details found!
        </Metric>
      </div>
    );
  }

  return (
    <Card>
      <p className="text-tremor-title font-semibold">
        Loan Application Details
      </p>
      <div className="grid-cols-3 grid mt-6">
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Loan Purpose
          </span>
          <span className="text-sm font-medium">{leadData.purpose}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Monthly Income
          </span>
          <span className="text-sm font-medium">{leadData.monthlyIncome}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Loan Required
          </span>
          <span className="text-sm font-medium">{leadData.loanRequired}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">City</span>
          <span className="text-sm font-medium">{leadData.city}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">State</span>
          <span className="text-sm font-medium">{leadData.state}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Pincode
          </span>
          <span className="text-sm font-medium">{leadData.pincode}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Loan Status
          </span>
          <Badge color={selectPillColor(enumCleaner(leadData.status))}>
            {enumCleaner(leadData.status)}
          </Badge>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">Source</span>
          <span className="text-sm font-medium">{leadData.utmSource}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Assignee
          </span>
          <span className="text-sm font-medium">{leadData.leadAssignee}</span>
        </div>
        <div className="my-2 flex-col flex">
          <span className="text-xs font-medium text-gray-400 mb-1">
            Created At
          </span>
          <span className="text-sm font-medium">
            {format(parseISO(leadData.createdAt), 'dd-MM-yyyy hh:mm:ss')}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default LoanApplicationDetails;
