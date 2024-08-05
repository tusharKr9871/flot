'use client';

import Address from './address';
import Reference from './reference';
import Employment from './employment';
import KYC from './kyc';
import Document from './document';
import LoanApplicationDetails from './loan-application';
import Assets from './assets';

export const ProfileTab = ({ leadId }: { leadId: string }) => {
  return (
    <div className="flex flex-col">
      <LoanApplicationDetails leadId={leadId} />
      <Address leadId={leadId} />
      <Reference leadId={leadId} />
      <Employment leadId={leadId} />
      <Assets leadId={leadId} />
      <KYC leadId={leadId} />
      <Document leadId={leadId} />
    </div>
  );
};
