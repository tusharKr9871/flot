'use client';

import PaydayPendingTable from '@/components/collection-data-table/payday-data-table';
import DateRangeSelect from '@/components/date-range-select';
import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import { useAuth } from '@/context/AuthContextProvider';
import { usePendingLoans } from '@/hooks/loan-api';
import { axiosInstance } from '@/network/axiosInstance';
import { DateRangeFormType } from '@/shared/shared-types';
import { handleDownload } from '@/utils/utils';
import { Card, Flex, Metric, ProgressBar, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const PaydayPending = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);

  const [open, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const setProgressFunction = ({
    totalTimeInSeconds,
  }: {
    totalTimeInSeconds: number;
  }) => {
    const startTime = new Date().getTime();
    const interval = 100; // Update every second

    const updateProgress = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const percentCompleted = Math.min(
        (elapsedTime / (totalTimeInSeconds * 1000)) * 100,
        100,
      );

      setProgress(percentCompleted);

      if (percentCompleted < 95) {
        setTimeout(updateProgress, interval);
      }
    };

    updateProgress();
  };

  const { user } = useAuth();
  const { control, watch } = useForm<DateRangeFormType>({
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const dateRange = watch('dateRange');

  const { pendingLoansData, isFetchingPendingLoansData } = usePendingLoans({
    loanFilter: 'payday',
    pageNumber,
    searchTerm,
    startDate: dateRange.from,
    endDate: dateRange.to,
    assigneeId,
  });
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      toast.success('Download started');
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/download-reports/download-paydaypending`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (dateRange.from && dateRange.to) {
        url.searchParams.append(
          'startDate',
          format(dateRange.from, 'dd-MM-yyyy'),
        );
        url.searchParams.append('endDate', format(dateRange.to, 'dd-MM-yyyy'));
      }

      if (searchTerm) {
        url.searchParams.append('searchTerm', searchTerm);
      }

      const response = await axiosInstance.get(url as unknown as string);
      handleDownload(response.data, 'Payday Pending');
      setProgress(100);
      setIsOpen(false);
      setProgress(0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Download failed');
      setLoading(false);
      setIsOpen(false);
      return null;
    }
  };

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
          <Metric>Payday Pending</Metric>
          <div className="flex flex-row">
            <div className="mr-4">
              {(user?.role === 'Admin' ||
                user?.role === 'Accounts' ||
                user?.role === 'Service') && (
                <PrimaryCTA
                  ctaText="Export"
                  onClick={() => {
                    setIsOpen(true);
                    fetchData();
                    setProgressFunction({
                      totalTimeInSeconds:
                        (pendingLoansData?.loansCount || 1) / 35,
                    });
                  }}
                  icon="export"
                  loading={loading}
                  disabled={!!loading}
                />
              )}
            </div>
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
        {isFetchingPendingLoansData ? (
          <div className="h-full mt-8">
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          </div>
        ) : (
          <PaydayPendingTable
            tableData={pendingLoansData?.loans || []}
            totalLeads={pendingLoansData?.loansCount || 1}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            assigneeId={assigneeId}
            setAssigneeId={setAssigneeId}
          />
        )}
      </Card>
      <ModalContainer
        isOpen={open}
        onClose={() => {}}
        styles="bg-white min-w-[18rem]">
        <div className="">
          <Title className="pb-4">Generating File</Title>
          <Flex>
            <Text>{Math.round(progress)}%</Text>
          </Flex>
          <ProgressBar value={progress} color="teal" className="mt-3" />
        </div>
      </ModalContainer>
    </div>
  );
};

export default PaydayPending;
