import { useRoleDisbursalAmount } from '@/hooks/dashboard-api';
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

const DisbursalReportTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const {
    roleDisbursalAmountData: creditManagerDisbursals,
    isFetchingRoleDisbursalAmountData: isFetchingCreditManagerDisbursals,
  } = useRoleDisbursalAmount({ role: 'Credit_Manager', month, year });
  const {
    roleDisbursalAmountData: loanOfficerDisbursals,
    isFetchingRoleDisbursalAmountData: isFetchingLoanOfficerDisbursals,
  } = useRoleDisbursalAmount({ role: 'Loan_Officer', month, year });

  if (isFetchingCreditManagerDisbursals || isFetchingLoanOfficerDisbursals) {
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
    creditManagerDisbursals?.forEach(disbursal => {
      totalTarget += disbursal['Disbursal Target'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      totalTarget += disbursal['Disbursal Target'];
    });
    return totalTarget;
  };

  const getTotalAchievement = () => {
    let totalAchievement = 0;
    creditManagerDisbursals?.forEach(disbursal => {
      totalAchievement += disbursal['Disbursal Amount'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      totalAchievement += disbursal['Disbursal Amount'];
    });
    return totalAchievement;
  };

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex-col flex">
          <Title>Disbursal Report Table</Title>
          <Subtitle className="my-4">{`Disbursals in month of ${month}, ${year}`}</Subtitle>
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
              Sanction Officer
            </TableHeaderCell>
            <TableHeaderCell className="text-white">Target</TableHeaderCell>
            <TableHeaderCell className="text-white">Achieved</TableHeaderCell>
            <TableHeaderCell className="text-white">Percent</TableHeaderCell>
            <TableHeaderCell className="text-white">Deficit</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {creditManagerDisbursals?.map(disbursal => (
            <TableRow key={disbursal.name}>
              <TableCell>{disbursal.name}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Disbursal Target'])}
              </TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Disbursal Amount'])}
              </TableCell>
              <TableCell>
                <Badge
                  color={getBadgeColor(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
                  )}>
                  {getAchievementPercent(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
                  )}
                  %
                </Badge>
              </TableCell>
              <TableCell>
                {formatIndianNumber(
                  getDeficit(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
                  ),
                )}
              </TableCell>
            </TableRow>
          ))}
          {loanOfficerDisbursals?.map(disbursal => (
            <TableRow key={disbursal.name}>
              <TableCell>{disbursal.name}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Disbursal Target'])}
              </TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Disbursal Amount'])}
              </TableCell>
              <TableCell>
                <Badge
                  color={getBadgeColor(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
                  )}>
                  {getAchievementPercent(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
                  )}
                  %
                </Badge>
              </TableCell>
              <TableCell>
                {formatIndianNumber(
                  getDeficit(
                    disbursal['Disbursal Amount'],
                    disbursal['Disbursal Target'],
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

export default DisbursalReportTable;
