import CallingStatusCard from '@/components/callingstatus-card';
import CustomerCard from '@/components/customer-card';
import { Dispatch, SetStateAction } from 'react';

const CustomerDetailsModal = ({
  leadId,
  pageNumber,
  setViewModalOpen,
}: {
  leadId: string;
  pageNumber: number;
  setViewModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // TODO: responsive modal in case of mobile, cross not visible
  return (
    <div className="flex flex-col sm:flex-row sm:mt-0 mt-56">
      <CustomerCard leadId={leadId} />
      <CallingStatusCard
        leadId={leadId}
        pageNumber={pageNumber}
        setViewModalOpen={setViewModalOpen}
      />
    </div>
  );
};

export default CustomerDetailsModal;
