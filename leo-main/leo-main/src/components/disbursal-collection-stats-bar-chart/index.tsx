import { useDisbursalCollectionStats } from '@/hooks/dashboard-api';
import { formatIndianNumber } from '@/utils/utils';
import { BarChart, Card, Subtitle, Title } from '@tremor/react';

const valueFormatter = (number: number) => formatIndianNumber(number);

const DisbursalCollectionStatsBarChart = () => {
  const {
    disbursalCollectionStatsData,
    isFetchingDisbursalCollectionStatsData,
  } = useDisbursalCollectionStats();

  if (isFetchingDisbursalCollectionStatsData) {
    return (
      <Card className="animate-pulse">
        <div>
          <div className="w-full h-72 mt-6 bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex-col flex">
          <Title>Disbursal and Collection Data</Title>
          <Subtitle className="my-4">
            Disbursals and Collections data for this day, month and year
          </Subtitle>
        </div>
      </div>

      <BarChart
        className="mt-6"
        data={disbursalCollectionStatsData || []}
        index="name"
        categories={['Today', 'Month', 'Year']}
        colors={['blue', 'red', 'emerald', 'orange', 'teal']}
        showAnimation={true}
        valueFormatter={valueFormatter}
        yAxisWidth={80}
      />
    </Card>
  );
};

export default DisbursalCollectionStatsBarChart;
