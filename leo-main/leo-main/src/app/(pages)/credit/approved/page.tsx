'use client';

import { Card, Metric } from '@tremor/react';
import CreditTable from '@/components/credit-data-table';
import { useEffect, useState } from 'react';
import { useFetchCreditLeads } from '@/hooks/leads-api';
import { useRouter } from 'next/navigation';
import TableLoader from '@/components/table-loader';
import SearchBox from '@/components/search-box';
import { Controller, useForm } from 'react-hook-form';
import { DateRangeFormType } from '@/shared/shared-types';
import DateRangeSelect from '@/components/date-range-select';

const Approved = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { control, watch } = useForm<DateRangeFormType>({
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const dateRange = watch('dateRange');

  const { allLeads, isFetchingLeads } = useFetchCreditLeads({
    pageNumber,
    leadType: 'Approved',
    searchTerm,
    startDate: dateRange.from,
    endDate: dateRange.to,
  });
  const router = useRouter();

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
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>Approved</Metric>
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
          {isFetchingLeads ? (
            <div className="h-full mt-8">
              <div className="h-full mt-8">
                <TableLoader />
              </div>
            </div>
          ) : (
            <CreditTable
              tableData={allLeads?.leads || []}
              totalLeads={allLeads?.leadsCount || 1}
              pageNumber={pageNumber}
              isEditable={true}
              setPageNumber={setPageNumber}
              approved={true}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Approved;
