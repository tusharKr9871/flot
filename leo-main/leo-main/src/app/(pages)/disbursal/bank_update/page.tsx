'use client';

import { Card, Metric } from '@tremor/react';
import BankUpdateTable from '@/components/bank-update-table';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TableLoader from '@/components/table-loader';
import { useBankUpdateLoans } from '@/hooks/loan-api';
import SearchBox from '@/components/search-box';

const BankUpdate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { bankUpdateLoansData, isFetchingBankUpdateLoansData } =
    useBankUpdateLoans({
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
            <Metric>Bank Update</Metric>
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              setPageNumber={setPageNumber}
            />
          </div>
          {isFetchingBankUpdateLoansData ? (
            <div className="h-full mt-8">
              <div className="h-full mt-8">
                <TableLoader />
              </div>
            </div>
          ) : (
            <BankUpdateTable
              tableData={bankUpdateLoansData?.bankUpdateData || []}
              totalLeads={bankUpdateLoansData?.bankUpdateCount || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default BankUpdate;
