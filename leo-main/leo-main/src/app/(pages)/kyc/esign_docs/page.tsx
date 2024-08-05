'use client';

import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TableLoader from '@/components/table-loader';
import SearchBox from '@/components/search-box';
import { useAllESignDocs } from '@/hooks/kyc-api';
import AllESignDocsTable from '@/components/all-e-sign-docs-data-table';

const ESignDocs = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { allESignDocsData, isFetchingESignDocsData } = useAllESignDocs({
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
            <Metric>All E-Sign Docs</Metric>
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              setPageNumber={setPageNumber}
            />
          </div>
          {isFetchingESignDocsData ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <AllESignDocsTable
              tableData={allESignDocsData?.eSignDocs || []}
              total={allESignDocsData?.count || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default ESignDocs;
