'use client';

import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import WaiverRequestsTable from '@/components/waiver-request-data-table';
import { useFetchWaiverRequests } from '@/hooks/collection-api';
import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const WaiverRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { allWaiverRequests, isFetchingWaiverRequests } =
    useFetchWaiverRequests({
      pageNumber,
      searchTerm,
    });
  const router = useRouter();

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);
  return (
    <div className="md:px-14 mx-2 pt-4 pb-4">
      <Card className="h-auto flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <Metric>Waiver Requests</Metric>
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            setPageNumber={setPageNumber}
          />
        </div>
        {isFetchingWaiverRequests ? (
          <div className="h-full mt-8">
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          </div>
        ) : (
          <WaiverRequestsTable
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            tableData={allWaiverRequests?.waiverRequests || []}
            total={allWaiverRequests?.waiverRequestCount || 0}
          />
        )}
      </Card>
    </div>
  );
};

export default WaiverRequests;
