'use client';

import PaymentDataTable from '@/components/collection-data-table/payment-data-table';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import { useFetchCreditCollections } from '@/hooks/collection-api';
import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const PartPayment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { allCollections, isFetchingCollections } = useFetchCreditCollections({
    pageNumber,
    collectionStatus: 'Part_Payment',
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
          <Metric>Part Payment</Metric>
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            setPageNumber={setPageNumber}
          />
        </div>
        {isFetchingCollections ? (
          <div className="h-full mt-8">
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          </div>
        ) : (
          <PaymentDataTable
            tableData={allCollections?.collections || []}
            totalCollections={allCollections?.collectedLeadsCount || 1}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        )}
      </Card>
    </div>
  );
};

export default PartPayment;
