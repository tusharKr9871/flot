'use client';

import { useLoanApproval } from '@/hooks/approval-api';
import ApprovalDetails from './approval/approval-details';
import CreditReport from './credit-report';
import Disbursal from './disbursal/disbursal';
import LoanDetails from './loan/loan-details';
import EMILoanDetails from './loan/emi-loan-details';

const ApprovalAndDisbursal = ({ leadId }: { leadId: string }) => {
  const { loanApprovalData } = useLoanApproval({
    leadId,
  });

  return (
    <div className="flex flex-col">
      <CreditReport leadId={leadId} />
      <ApprovalDetails leadId={leadId} />
      <Disbursal leadId={leadId} />
      {loanApprovalData?.loanType === 'payday' ? (
        <LoanDetails leadId={leadId} />
      ) : (
        <EMILoanDetails leadId={leadId} />
      )}
    </div>
  );
};

export default ApprovalAndDisbursal;
