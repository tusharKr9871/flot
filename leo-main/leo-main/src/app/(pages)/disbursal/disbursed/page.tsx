'use client';

import { Card, Metric } from '@tremor/react';
import CreditTable from '@/components/credit-data-table';
import { useFetchDisbursalLeads } from '@/hooks/leads-api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TableLoader from '@/components/table-loader';
import SearchBox from '@/components/search-box';
import { Controller, useForm } from 'react-hook-form';
import { DateRangeFormType } from '@/shared/shared-types';
import DateRangeSelect from '@/components/date-range-select';

const Disbursed = () => {
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

  const { disbursalLeads, isFetchingDisbursalLeads } = useFetchDisbursalLeads({
    pageNumber,
    leadType: 'Disbursed',
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
            <Metric>Disbursed</Metric>
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
          {isFetchingDisbursalLeads ? (
            <div className="h-full mt-8">
              <div className="h-full mt-8">
                <TableLoader />
              </div>
            </div>
          ) : (
            <CreditTable
              tableData={disbursalLeads?.leads || []}
              totalLeads={disbursalLeads?.leadsCount || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              disbursal={true}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Disbursed;
