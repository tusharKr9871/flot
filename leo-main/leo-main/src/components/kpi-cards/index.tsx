import { useKpiCards } from '@/hooks/dashboard-api';
import { formatIndianNumber } from '@/utils/utils';
import { Grid, Card, Flex, Metric, ProgressBar, Text } from '@tremor/react';
import { useState } from 'react';
import InputSelect from '../input-select';

const KpiCards = () => {
  const [kpiType, setKpiType] = useState('today');
  const month = (new Date().getMonth() + 1).toString();
  const year = new Date().getFullYear().toString();
  const day = '1';
  const { kpiCardsData, isFetchingKpiCardsData } = useKpiCards({
    year,
    month: kpiType === 'monthly' ? month : undefined,
    day: kpiType === 'today' ? day : undefined,
  });

  if (isFetchingKpiCardsData) {
    return (
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mb-4">
        <Card className="animate-pulse">
          <Flex alignItems="start">
            <div className="truncate">
              <div className="h-2.5 w-1/3 bg-gray-200"></div>
              <div className="h-4 w-2/3 bg-gray-200"></div>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
          </Flex>
        </Card>
        <Card className="animate-pulse">
          <Flex alignItems="start">
            <div className="truncate">
              <div className="h-2.5 w-1/3 bg-gray-200"></div>
              <div className="h-4 w-2/3 bg-gray-200"></div>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
          </Flex>
        </Card>
        <Card className="animate-pulse">
          <Flex alignItems="start">
            <div className="truncate">
              <div className="h-2.5 w-1/3 bg-gray-200"></div>
              <div className="h-4 w-2/3 bg-gray-200"></div>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
          </Flex>
        </Card>
      </Grid>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-end">
        <div className="w-1/5">
          <InputSelect
            options={[
              {
                key: '1',
                label: 'Today',
                value: 'today',
              },
              {
                key: '2',
                label: 'Monthly',
                value: 'monthly',
              },
              {
                key: '3',
                label: 'Yearly',
                value: 'yearly',
              },
            ]}
            value={kpiType}
            onChange={setKpiType}
            enableClear={false}
          />
        </div>
      </div>

      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {kpiCardsData?.map(item => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>{item.title}</Text>
                <Metric className="truncate text-gray-600">
                  {item.title !== 'In Progress Leads' &&
                  item.title !== 'Fresh Leads' &&
                  item.title !== 'Reloan Leads' &&
                  item.title !== 'Collection Leads' &&
                  item.title !== 'Leads' &&
                  item.title !== 'Documents Received' &&
                  item.title !== 'Interested leads'
                    ? formatIndianNumber(item.metric)
                    : item.metric}
                </Metric>
              </div>
            </Flex>

            <Flex className="mt-4 space-x-2">
              {kpiType !== 'today' &&
                (item.title === 'Leads' || item.target !== 0) && (
                  <>
                    <Text className="truncate">{`${item.progress}% (${
                      item.title === 'In Progress Leads' ||
                      item.title === 'Collection Leads' ||
                      item.title === 'Fresh Leads' ||
                      item.title === 'Reloan Leads' ||
                      item.title === 'Leads' ||
                      item.title === 'Documents Received' ||
                      item.title === 'Interested leads'
                        ? item.metric
                        : formatIndianNumber(item.metric)
                    })`}</Text>
                    <Text className="truncate">
                      {item.title !== 'In Progress Leads' &&
                      item.title !== 'Fresh Leads' &&
                      item.title !== 'Reloan Leads' &&
                      item.title !== 'Collection Leads' &&
                      item.title !== 'Leads' &&
                      item.title !== 'Documents Received' &&
                      item.title !== 'Interested leads'
                        ? formatIndianNumber(item.target)
                        : item.target}
                    </Text>
                  </>
                )}
            </Flex>
            {kpiType !== 'today' &&
              (item.title === 'In Progress Leads' || item.target !== 0) && (
                <ProgressBar
                  value={item.progress}
                  className="mt-2"
                  color={
                    item.progress < 30
                      ? 'red'
                      : item.progress < 50
                      ? 'yellow'
                      : item.progress < 100
                      ? 'blue'
                      : 'green'
                  }
                />
              )}
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default KpiCards;
