'use client';

import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TableLoader from '@/components/table-loader';
import SearchBox from '@/components/search-box';
import { useAllKyc } from '@/hooks/kyc-api';
import AllKycDataTable from '@/components/all-kyc-data-table';

const VideoKYC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { allKycRequestsData, isFetchingAllKycRequestsData } = useAllKyc({
    pageNumber,
    searchTerm,
  });
  const router = useRouter();

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  return (
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>All Video KYC Requests</Metric>
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              setPageNumber={setPageNumber}
            />
          </div>
          {isFetchingAllKycRequestsData ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <AllKycDataTable
              tableData={allKycRequestsData?.kycData || []}
              total={allKycRequestsData?.count || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default VideoKYC;
