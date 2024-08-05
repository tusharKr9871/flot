'use client';

import { Card, Flex, Metric, ProgressBar, Title, Text } from '@tremor/react';
import LeadsDataTable from '@/components/leads-data-table';
import { useFetchLeads } from '@/hooks/leads-api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TableLoader from '@/components/table-loader';
import SearchBox from '@/components/search-box';
import { Controller, useForm } from 'react-hook-form';
import DateRangeSelect from '@/components/date-range-select';
import { DateRangeFormType } from '@/shared/shared-types';
import PrimaryCTA from '@/components/primary-cta';
import { fetchLeadsDataForDownload, setProgressFunction } from '@/utils/utils';
import ModalContainer from '@/components/modal';

const CallbackLeads = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [creditManagerId, setCreditManagerId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { control, watch } = useForm<DateRangeFormType>({
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });
  const dateRange = watch('dateRange');

  const { allLeads, isFetchingLeads } = useFetchLeads({
    pageNumber,
    searchTerm,
    leadType: 'Callback',
    startDate: dateRange.from,
    endDate: dateRange.to,
    assigneeId,
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
            <Metric>Callback Leads</Metric>
            <div className="flex flex-row">
              <div className="flex flex-row">
                <div className="mr-4">
                  <PrimaryCTA
                    ctaText="Export"
                    onClick={() => {
                      fetchLeadsDataForDownload({
                        startDate: dateRange.from,
                        endDate: dateRange.to,
                        searchTerm,
                        leadType: 'Callback',
                        assigneeId,
                        setLoading,
                        setIsOpen,
                        setProgress,
                      });
                      setProgressFunction({
                        totalTimeInSeconds: (allLeads?.leadsCount || 1) / 40,
                        setProgress,
                      });
                    }}
                    loading={loading}
                    icon="export"
                  />
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
            <LeadsDataTable
              tableData={allLeads?.leads || []}
              totalLeads={allLeads?.leadsCount || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              assigneeId={assigneeId}
              setAssigneeId={setAssigneeId}
              creditManagerId={creditManagerId}
              setCreditManagerId={setCreditManagerId}
            />
          )}
        </Card>{' '}
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

export default CallbackLeads;
