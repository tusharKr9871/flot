'use client';

import { Card, Flex, Metric, ProgressBar, Title, Text } from '@tremor/react';
import ReportsDisbursedDataTable from '@/components/reports-disbursed-data-table';
import { useEffect, useState } from 'react';
import { useDisbursalReport } from '@/hooks/reports-api';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import { useRouter } from 'next/navigation';
import { DateRangeFormType } from '@/shared/shared-types';
import { Controller, useForm } from 'react-hook-form';
import DateRangeSelect from '@/components/date-range-select';
import PrimaryCTA from '@/components/primary-cta';
import { axiosInstance } from '@/network/axiosInstance';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContextProvider';
import toast from 'react-hot-toast';
import ModalContainer from '@/components/modal';
import { handleDownload } from '@/utils/utils';

const DisbursedReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
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

  const { control, watch } = useForm<DateRangeFormType>({
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const dateRange = watch('dateRange');

  const { disbursalReportData, isFetchingDisbursalReportData } =
    useDisbursalReport({
      pageNumber,
      searchTerm,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dateRange.from !== undefined && dateRange.to !== undefined) {
      setPageNumber(1);
    }
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      toast.success('Download started');
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/download-reports/download-disbursal-report`,
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
      handleDownload(response.data, 'Disbursal Report');
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

  return (
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>Disbursed Data Report</Metric>
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
                          (disbursalReportData?.count || 1) / 35,
                      });
                    }}
                    icon="export"
                    loading={loading}
                  />
                )}
              </div>
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
              <SearchBox
                value={searchTerm}
                onChange={setSearchTerm}
                setPageNumber={setPageNumber}
              />
            </div>
          </div>
          {isFetchingDisbursalReportData ? (
            <div className="h-full mt-8">
              <div className="h-full mt-8">
                <TableLoader />
              </div>
            </div>
          ) : (
            <ReportsDisbursedDataTable
              tableData={disbursalReportData?.disbursalReports || []}
              totalCount={disbursalReportData?.count || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
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
    </>
  );
};

export default DisbursedReport;
