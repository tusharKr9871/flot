import CustomerApplicationHistoryCard from "@/components/customer-application-history-card";
import CustomerApplicationStatusCard from "@/components/customer-application-status-card";
import CustomerDocuments from "@/components/customer-documents";
import CustomerCard from "@/components/customer-name-card";

const CustomerProfile = () => {
  return (
    <div className="bg-gray-100 lg:px-16 xs:px-12 px-8 pb-20">
      <div className="md:pt-40 pt-28 flex md:flex-row flex-col pb-10 justify-between">
        <CustomerCard />
        <CustomerApplicationStatusCard />
        <CustomerDocuments />
      </div>
      <CustomerApplicationHistoryCard />
    </div>
  );
};

export default CustomerProfile;
