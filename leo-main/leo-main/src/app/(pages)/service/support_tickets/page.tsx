'use client';

import DateRangeSelect from '@/components/date-range-select';
import TableLoader from '@/components/table-loader';
import { Card, Metric } from '@tremor/react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRangeFormType } from '@/shared/shared-types';
import { useFetchCustomerSupportTickets } from '@/hooks/tickets-api';
import TicketsTable from '@/components/tickets-table';

const Tickets = () => {
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

  const { customerSupportTicketData, isFetchingCustomerSupportTicketData } =
    useFetchCustomerSupportTickets({
      pageNumber,
      // filterBy = null,
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
    <div className="md:px-14 mx-2 pt-4 pb-4">
      <Card className="h-auto flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <Metric>Support Tickets</Metric>
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
          </div>
        </div>
        {isFetchingCustomerSupportTicketData ? (
          <div className="h-full mt-8">
            <TableLoader />
          </div>
        ) : (
          <TicketsTable
            tableData={customerSupportTicketData?.tickets || []}
            totalTickets={customerSupportTicketData?.ticketCount || 0}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        )}
      </Card>
    </div>
  );
};

export default Tickets;
