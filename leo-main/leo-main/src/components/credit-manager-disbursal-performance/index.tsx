import { useCreditManagerReporteeStats } from '@/hooks/dashboard-api';
import { Card, Color, LineChart, Subtitle, Title } from '@tremor/react';
import InputSelect from '../input-select';
import { useState } from 'react';
import { Months } from '@/constants/months';
import { formatIndianNumber, generateYears, getMonthName } from '@/utils/utils';

const valueFormatter = (number: number) => formatIndianNumber(number);

const CreditManagerDisbursalLineChart = ({ color }: { color: Color[] }) => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { creditManagerReporteeStats, isFetchingCreditManagerReporteeStats } =
    useCreditManagerReporteeStats({ month, year });

  if (isFetchingCreditManagerReporteeStats) {
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
          <Title>Performance</Title>
          <Subtitle className="my-4">{`Disbursals  in month of ${month}, ${year}`}</Subtitle>
        </div>
        <div className="flex flex-row justify-end">
          <div className="flex flex-row basis-1/2">
            <InputSelect
              label="Month"
              value={month}
              onChange={setMonth}
              options={Months}
              styles="mr-2"
              //enableClear={false}
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

      <LineChart
        className="mt-5 h-72"
        data={creditManagerReporteeStats || []}
        index="day"
        categories={['Disbursal']}
        colors={color}
        showAnimation={true}
        valueFormatter={valueFormatter}
        yAxisWidth={80}
      />
    </Card>
  );
};

export default CreditManagerDisbursalLineChart;
