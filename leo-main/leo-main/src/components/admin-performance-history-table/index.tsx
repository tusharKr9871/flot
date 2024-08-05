import { Months } from '@/constants/months';
import { useAdminPerformanceHistory } from '@/hooks/dashboard-api';
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

const AdminPerformanceHistoryTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { adminPerformanceHistory, isFetchingAdminPerformanceHistory } =
    useAdminPerformanceHistory({
      month,
      year,
    });

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

  const getTotalLeads = () => {
    let totalLeads = 0;
    adminPerformanceHistory?.forEach(history => {
      totalLeads += history.Leads;
    });
    return totalLeads;
  };

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
              <TableHead className="bg-slate-400">
                <TableRow>
                  <TableHeaderCell className="text-white">
                    Month
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Leads
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Disbursals
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Collections
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-slate-600">
                {adminPerformanceHistory?.map((history, index) => (
                  <TableRow
                    key={history.date}
                    className={classNames(index % 2 !== 0 && 'bg-gray-100')}>
                    <TableCell>{history.date}</TableCell>
                    <TableCell>{history.Leads}</TableCell>
                    <TableCell>
                      {formatIndianNumber(history.Disbursals)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(history.Collections)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-500 text-white">
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell>
                    <b>{getTotalLeads()}</b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        adminPerformanceHistory?.reduce(
                          (total, history) => total + history.Disbursals,
                          0,
                        ) || 0,
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        adminPerformanceHistory?.reduce(
                          (total, history) => total + history.Collections,
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

export default AdminPerformanceHistoryTable;
