import { Months } from '@/constants/months';
import { useAdminCollectionDailyReport } from '@/hooks/dashboard-api';
import {
  formatIndianNumber,
  generateYears,
  getAchievementPercent,
  getBadgeColor,
  getMonthName,
} from '@/utils/utils';

import {
  Card,
  Title,
  TableHead,
  Table,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from '@tremor/react';
import InputSelect from '../input-select';
import { useState } from 'react';
import classNames from 'classnames';

const AdminCollectionDailyTrack = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { adminCollectionDailyTrack, isFetchingAdminCollectionDailyTrack } =
    useAdminCollectionDailyReport({
      month,
      year,
    });

  if (isFetchingAdminCollectionDailyTrack) {
    return (
      <Card className="animate-pulse">
        <div className="w-16 h-2.5 bg-gray-200"></div>
        <div>
          <div className="w-full h-72 mt-5 bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  const sumOfColumn = ({ columnName }: { columnName: string }) => {
    return (
      adminCollectionDailyTrack?.reduce((acc, curr) => {
        //@ts-ignore
        return acc + curr[columnName];
      }, 0) || 0
    );
  };

  return (
    <div className="">
      <Card>
        <>
          <div className="md:flex justify-between">
            <div>
              <Title>Collection Daily Track </Title>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <div className="flex flex-row basis-1/2">
              <InputSelect
                label="Month"
                value={month}
                onChange={setMonth}
                options={Months}
                enableClear={false}
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
                    Due Cases
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Loan Amount
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Repay Amount
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Collected
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Collected Cases
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Collection Pending
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Pending Cases
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Part Payment
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Part Payment Cases
                  </TableHeaderCell>
                  <TableHeaderCell className="text-white">
                    Collected Percentage
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-slate-600">
                {adminCollectionDailyTrack?.map((item, index) => (
                  <TableRow
                    key={item.date}
                    className={classNames(index % 2 !== 0 && 'bg-gray-100')}>
                    <TableCell>
                      <b>{item.date}</b>
                    </TableCell>
                    <TableCell>{item.dueCases}</TableCell>
                    <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
                    <TableCell>
                      {formatIndianNumber(item.repayAmount)}
                    </TableCell>
                    <TableCell>{formatIndianNumber(item.collected)}</TableCell>
                    <TableCell>
                      {formatIndianNumber(item.collectedCases).slice(1)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(item.collectionPending)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(
                        item.dueCases - item.collectedCases,
                      ).slice(1)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(item.partPayment)}
                    </TableCell>
                    <TableCell>
                      {formatIndianNumber(item.partPaymentCases).slice(1)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={getBadgeColor(item.collected, item.repayAmount)}>
                        {getAchievementPercent(
                          item.collected,
                          item.repayAmount,
                        )}
                        %
                      </Badge>
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
                        sumOfColumn({ columnName: 'dueCases' }),
                      ).slice(1)}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'loanAmount' }),
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'repayAmount' }),
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'collected' }),
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'collectedCases' }),
                      ).slice(1)}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'collectionPending' }),
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'dueCases' }) -
                          sumOfColumn({ columnName: 'collectedCases' }),
                      ).slice(1)}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'partPayment' }),
                      )}
                    </b>
                  </TableCell>
                  <TableCell>
                    <b>
                      {formatIndianNumber(
                        sumOfColumn({ columnName: 'partPaymentCases' }),
                      ).slice(1)}
                    </b>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={getBadgeColor(
                        sumOfColumn({ columnName: 'collected' }),
                        sumOfColumn({ columnName: 'collectionPending' }),
                      )}>
                      {getAchievementPercent(
                        sumOfColumn({ columnName: 'collected' }),
                        sumOfColumn({ columnName: 'collectionPending' }),
                      )}
                      %
                    </Badge>
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

export default AdminCollectionDailyTrack;
