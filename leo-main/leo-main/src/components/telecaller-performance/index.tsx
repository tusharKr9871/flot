import { Months } from '@/constants/months';
import { useTeleCallerPerformance } from '@/hooks/dashboard-api';
import { generateYears, getMonthName } from '@/utils/utils';
import { Card, Title, TabGroup, TabList, Tab, AreaChart } from '@tremor/react';
import { useState } from 'react';
import InputSelect from '../input-select';

const Kpis = {
  Sales: ['Documents Received', 'Interested'],
};

const kpiList = [Kpis.Sales];

const TeleCallerPerformance = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { teleCallerPerformance, isFetchingTeleCallerPerformance } =
    useTeleCallerPerformance({
      month,
      year,
    });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = kpiList[selectedIndex];

  if (isFetchingTeleCallerPerformance) {
    return (
      <Card className="animate-pulse">
        <div className="w-16 h-2.5 bg-gray-200"></div>
        <div>
          <div className="w-full h-72 mt-5 bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <>
          <div className="md:flex justify-between">
            <div>
              <Title>Performance History </Title>
            </div>
            <div>
              <TabGroup index={selectedIndex} onIndexChange={setSelectedIndex}>
                <TabList color="gray" variant="solid">
                  <Tab>Documents Received vs Interested</Tab>
                </TabList>
              </TabGroup>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="flex flex-row basis-1/2">
              <InputSelect
                label="Month"
                value={month}
                onChange={setMonth}
                options={Months}
                styles="mr-2"
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
          <div className="mt-8">
            <AreaChart
              className="mt-5 h-72"
              data={teleCallerPerformance || []}
              index="date"
              categories={selectedKpi}
              colors={['blue', 'green']}
              showAnimation={true}
              //valueFormatter={valueFormatter(selectedIndex)}
              yAxisWidth={80}
            />
          </div>
        </>
      </Card>
    </div>
  );
};

export default TeleCallerPerformance;
