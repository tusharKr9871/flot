import { Months } from '@/constants/months';
import { useTeleCallerPerformance } from '@/hooks/dashboard-api';
import { generateYears, getMonthName } from '@/utils/utils';
import {
  Card,
  Title,
  TableHead,
  Table,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@tremor/react';
import { useState } from 'react';
import InputSelect from '../input-select';
import classNames from 'classnames';

const TeleCallerPerformanceTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { teleCallerPerformance, isFetchingTeleCallerPerformance } =
    useTeleCallerPerformance({
      month,
      year,
    });

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
    <div className="">
      <Card>
        <>
          <div className="md:flex justify-between">
            <div>
              <Title>Performance History </Title>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Month</TableHeaderCell>
                  <TableHeaderCell>Leads</TableHeaderCell>
                  <TableHeaderCell>Disbursals</TableHeaderCell>
                  <TableHeaderCell>Collections</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-slate-600">
                {teleCallerPerformance?.map((history, index) => (
                  <TableRow
                    key={history.date}
                    className={classNames(index % 2 === 0 && 'bg-gray-100')}>
                    <TableCell>{history.date}</TableCell>
                    <TableCell>{history.Interested}</TableCell>
                    <TableCell>{history['Documents Received']}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-500 text-white">
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {teleCallerPerformance?.reduce(
                        (total, history) => total + history.Interested,
                        0,
                      ) || 0}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {teleCallerPerformance?.reduce(
                        (total, history) =>
                          total + history['Documents Received'],
                        0,
                      ) || 0}
                    </b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      </Card>
    </div>
  );
};

export default TeleCallerPerformanceTable;
