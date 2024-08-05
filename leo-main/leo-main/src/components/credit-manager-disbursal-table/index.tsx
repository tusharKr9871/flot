import { Months } from '@/constants/months';
import { useCreditManagerReporteeStats } from '@/hooks/dashboard-api';
import { formatIndianNumber, generateYears, getMonthName } from '@/utils/utils';
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

const CreditManagerDisbursalTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { creditManagerReporteeStats, isFetchingCreditManagerReporteeStats } =
    useCreditManagerReporteeStats({ month, year });

  if (isFetchingCreditManagerReporteeStats) {
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
                  <TableHeaderCell>Disbursals</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-slate-600">
                {creditManagerReporteeStats?.map((history, index) => (
                  <TableRow
                    key={history.day}
                    className={classNames(index % 2 === 0 && 'bg-gray-100')}>
                    <TableCell>{history.day}</TableCell>
                    <TableCell>
                      {formatIndianNumber(history.Disbursal)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-500 text-white">
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        creditManagerReporteeStats?.reduce(
                          (total, history) => total + history.Disbursal,
                          0,
                        ) || 0,
                      )}
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

export default CreditManagerDisbursalTable;
