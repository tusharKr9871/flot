'use client';

import { useFetchAllCollections } from '@/hooks/collection-api';
import { DateRangeFormType } from '@/shared/shared-types';
import { Card, Metric } from '@tremor/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import DateRangeSelect from '@/components/date-range-select';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import AllCollectionsTable from '@/components/all-collections-table';

const AllCollections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();
  const { control, watch } = useForm<DateRangeFormType>({
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const dateRange = watch('dateRange');
  const { allCollections, isFetchingCollections } = useFetchAllCollections({
    pageNumber,
    searchTerm,
    startDate: dateRange.from,
    endDate: dateRange.to,
  });

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dateRange.from !== undefined && dateRange.to !== undefined) {
      setPageNumber(1);
    }
  }, [dateRange]);

  return (
    <div className="md:px-14 mx-2 pt-4 pb-4">
      <Card className="h-auto flex flex-col">
        <Metric>All Collections Data</Metric>
        <div className="flex flex-row justify-end items-center">
          <div className="flex flex-row">
            <div className="flex flex-row">
              <Controller
                name="dateRange"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DateRangeSelect
                    label=""
                    onChange={onChange}
                    value={value}
                    placeholder="Date Range"
                    styles="mr-4"
                  />
                )}
              />
            </div>

            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>
        {isFetchingCollections ? (
          <div className="h-full mt-8">
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          </div>
        ) : (
          <AllCollectionsTable
            tableData={allCollections?.collections || []}
            totalLeads={allCollections?.collectionsCount || 1}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        )}
      </Card>
    </div>
  );
};

export default AllCollections;
