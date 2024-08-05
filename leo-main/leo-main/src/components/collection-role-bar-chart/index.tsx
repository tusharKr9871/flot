import { useRoleCollectionAmount } from '@/hooks/dashboard-api';
import { BarChart, Card, Color, Subtitle, Title } from '@tremor/react';
import InputSelect from '../input-select';
import { useState } from 'react';
import { Months } from '@/constants/months';
import {
  enumCleaner,
  formatIndianNumber,
  generateYears,
  getMonthName,
} from '@/utils/utils';

const valueFormatter = (number: number) => formatIndianNumber(number);

const CollectionRoleBarChart = ({
  role,
  color,
}: {
  role: string;
  color: Color[];
}) => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { roleCollectionAmountData, isFetchingRoleCollectionAmountData } =
    useRoleCollectionAmount({ role, month, year });

  if (isFetchingRoleCollectionAmountData) {
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
          <Title>{enumCleaner(role)} Performance</Title>
          <Subtitle className="my-4">{`Collections per ${enumCleaner(
            role,
          )} in month of ${month}, ${year}`}</Subtitle>
        </div>
        <div className="flex flex-row justify-end">
          <div className="flex flex-row basis-1/2">
            <InputSelect
              label="Month"
              value={month}
              onChange={setMonth}
              options={Months}
              styles="mr-2"
              enableClear={false}
            />
            <InputSelect
              label="Year"
              value={year}
              onChange={setYear}
              options={generateYears()}
              enableClear={false}
            />
          </div>
        </div>
      </div>

      <BarChart
        className="mt-6"
        data={roleCollectionAmountData || []}
        index="name"
        categories={['Collection Amount', 'Collection Target']}
        colors={color}
        valueFormatter={valueFormatter}
        showAnimation={true}
        customTooltip={CustomTooltip}
        yAxisWidth={100}
      />
    </Card>
  );
};

const CustomTooltip = ({
  payload,
  active,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  active: boolean | undefined;
}) => {
  if (!active || !payload) return null;

  const totalCollectedPercent = Math.ceil(
    (payload[0].value / payload[1].value) * 100,
  );

  return (
    <div className="bg-white p-4 rounded-tremor-default shadow-tremor-dropdown border border-tremor-border text-tremor-content">
      {payload.map(
        (
          category: { color: string; dataKey: string; value: number },
          idx: number,
        ) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className={`shrink-0 rounded-tremor-full border-tremor-background shadow-tremor-card w-3 h-3 border-2 bg-${category.color}-500`}
            />
            <div className="flex items-center justify-between flex-1 space-x-4">
              <p className="text-right whitespace-nowrap text-tremor-content text-sm">
                {category.dataKey}
              </p>
              <p className="font-medium tabular-nums text-right whitespace-nowrap text-tremor-content-emphasis text-sm">
                {formatIndianNumber(category.value)}
              </p>
            </div>
          </div>
        ),
      )}
      <div className="flex flex-row items-center space-x-4 mt-2">
        <p className="text-tremor-content text-sm">Total collected</p>
        <p className="font-medium tabular-nums text-right whitespace-nowrap text-tremor-content-emphasis text-sm">
          {isNaN(totalCollectedPercent) ? 0 : totalCollectedPercent}%
        </p>
      </div>
    </div>
  );
};

export default CollectionRoleBarChart;
