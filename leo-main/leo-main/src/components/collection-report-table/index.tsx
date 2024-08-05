import { useRoleCollectionAmount } from '@/hooks/dashboard-api';
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

const CollectionReportTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const {
    roleCollectionAmountData: collectionExecutiveCollectionData,
    isFetchingRoleCollectionAmountData: isFetchingCollectionExecutiveCollection,
  } = useRoleCollectionAmount({ role: 'Collection_Executive', month, year });

  const {
    roleCollectionAmountData: teleCallerCollectionData,
    isFetchingRoleCollectionAmountData: isFetchingTeleCallerCollection,
  } = useRoleCollectionAmount({ role: 'Tele_Caller', month, year });

  if (
    isFetchingCollectionExecutiveCollection ||
    isFetchingTeleCallerCollection
  ) {
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
    collectionExecutiveCollectionData?.forEach(collection => {
      totalTarget += collection['Collection Target'];
    });
    teleCallerCollectionData?.forEach(collection => {
      totalTarget += collection['Collection Target'];
    });
    return totalTarget;
  };

  const getTotalAchievement = () => {
    let totalAchievement = 0;
    collectionExecutiveCollectionData?.forEach(collection => {
      totalAchievement += collection['Collection Amount'];
    });
    teleCallerCollectionData?.forEach(collection => {
      totalAchievement += collection['Collection Amount'];
    });
    return totalAchievement;
  };

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex-col flex">
          <Title>Collections Performance</Title>
          <Subtitle className="my-4">{`Collections in month of ${month}, ${year}`}</Subtitle>
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
        <TableHead className="bg-slate-400">
          <TableRow>
            <TableHeaderCell className="text-white">
              Collection Officer
            </TableHeaderCell>
            <TableHeaderCell className="text-white">Target</TableHeaderCell>
            <TableHeaderCell className="text-white">Achieved</TableHeaderCell>
            <TableHeaderCell className="text-white">Percent</TableHeaderCell>
            <TableHeaderCell className="text-white">Deficit</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {collectionExecutiveCollectionData?.map(collection => (
            <TableRow key={collection.name}>
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
          {teleCallerCollectionData?.map(collection => (
            <TableRow key={collection.name}>
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
          <TableRow className="bg-gray-500 text-white">
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

export default CollectionReportTable;
