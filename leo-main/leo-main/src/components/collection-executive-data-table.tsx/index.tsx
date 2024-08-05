import { useCollectionExecutiveAmount } from '@/hooks/dashboard-api';
import {
  Badge,
  Card,
  Subtitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import InputSelect from '../input-select';
import { useState } from 'react';
import { Months } from '@/constants/months';
import {
  formatIndianNumber,
  generateYears,
  getAchievementPercent,
  getBadgeColor,
  getDeficit,
  getMonthName,
} from '@/utils/utils';
import classNames from 'classnames';

const CollectionExecutiveDataTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { collectionExecutiveAmount, isFetchingCollectionExecutiveAmountData } =
    useCollectionExecutiveAmount({ month, year });

  if (isFetchingCollectionExecutiveAmountData) {
    return (
      <Card className="animate-pulse">
        <div>
          <div className="w-full h-72 mt-6 bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  const getTotalTarget = () => {
    let totalTarget = 0;
    collectionExecutiveAmount?.forEach(collection => {
      totalTarget += collection['Collection Target'];
    });
    return totalTarget;
  };

  const getTotalAchievement = () => {
    let totalAchievement = 0;
    collectionExecutiveAmount?.forEach(collection => {
      totalAchievement += collection['Collection Amount'];
    });
    return totalAchievement;
  };

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex-col flex">
          <Title>Collection Executive Performance</Title>
          <Subtitle className="my-4">{`Collections per Collection Executive in month of ${month}, ${year}`}</Subtitle>
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

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Sanction Officer</TableHeaderCell>
            <TableHeaderCell>Target</TableHeaderCell>
            <TableHeaderCell>Achieved</TableHeaderCell>
            <TableHeaderCell>Percent</TableHeaderCell>
            <TableHeaderCell>Deficit</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {collectionExecutiveAmount?.map((collection, index) => (
            <TableRow
              key={collection.name}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell>{collection.name}</TableCell>
              <TableCell>
                {formatIndianNumber(collection['Collection Target'])}
              </TableCell>
              <TableCell>
                {formatIndianNumber(collection['Collection Amount'])}
              </TableCell>
              <TableCell>
                <Badge
                  color={getBadgeColor(
                    collection['Collection Amount'],
                    collection['Collection Target'],
                  )}>
                  {getAchievementPercent(
                    collection['Collection Amount'],
                    collection['Collection Target'],
                  )}
                  %
                </Badge>
              </TableCell>
              <TableCell>
                {formatIndianNumber(
                  getDeficit(
                    collection['Collection Amount'],
                    collection['Collection Target'],
                  ),
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>{formatIndianNumber(getTotalTarget())}</b>
            </TableCell>
            <TableCell>
              <b>{formatIndianNumber(getTotalAchievement())}</b>
            </TableCell>
            <TableCell>
              <Badge
                color={getBadgeColor(getTotalAchievement(), getTotalTarget())}>
                {getAchievementPercent(getTotalAchievement(), getTotalTarget())}
                %
              </Badge>
            </TableCell>
            <TableCell>
              <b>
                {formatIndianNumber(getTotalTarget() - getTotalAchievement())}
              </b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

export default CollectionExecutiveDataTable;
