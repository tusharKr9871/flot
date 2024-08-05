import { Months } from '@/constants/months';
import { useAdminPerformanceHistory } from '@/hooks/dashboard-api';
import { formatIndianNumber, generateYears, getMonthName } from '@/utils/utils';
import { Card, Title, TabGroup, TabList, Tab, AreaChart } from '@tremor/react';
import { useState } from 'react';
import InputSelect from '../input-select';

const valueFormatter = (index: number) => {
  if (index === 0) return (number: number) => formatIndianNumber(number);
  return (number: number) => `${number}`;
};

const Kpis = {
  Sales: ['Disbursals', 'Collections'],
  Customers: ['Leads'],
};

const kpiList = [Kpis.Sales, Kpis.Customers];

const AdminPerformanceHistory = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { adminPerformanceHistory, isFetchingAdminPerformanceHistory } =
    useAdminPerformanceHistory({
      month,
      year,
    });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedKpi = kpiList[selectedIndex];

  if (isFetchingAdminPerformanceHistory) {
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
                  <Tab>Disbursals & Collections</Tab>
                  <Tab>Leads</Tab>
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
              data={adminPerformanceHistory || []}
              index="date"
              categories={selectedKpi}
              colors={['blue', 'green']}
              showAnimation={true}
              valueFormatter={valueFormatter(selectedIndex)}
              yAxisWidth={80}
            />
          </div>
        </>
      </Card>
    </div>
  );
};

export default AdminPerformanceHistory;
