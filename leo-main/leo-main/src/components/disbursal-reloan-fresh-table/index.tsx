import { useDisbursalFreshReloan } from '@/hooks/dashboard-api';
import {
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
import { formatIndianNumber, generateYears, getMonthName } from '@/utils/utils';

const DisbursalReloanFreshTable = () => {
  const [month, setMonth] = useState(
    getMonthName(parseInt((new Date().getMonth() + 1).toString())),
  );
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const {
    disbursalFreshReloanData: creditManagerDisbursals,
    isFetchingDisbursalFreshReloanData: creditManagerDisbursalLoading,
  } = useDisbursalFreshReloan({ month, year, role: 'Credit_Manager' });
  const {
    disbursalFreshReloanData: loanOfficerDisbursals,
    isFetchingDisbursalFreshReloanData: loanOfficerDisbursalLoading,
  } = useDisbursalFreshReloan({ month, year, role: 'Loan_Officer' });

  if (creditManagerDisbursalLoading || loanOfficerDisbursalLoading) {
    return (
      <Card className="animate-pulse">
        <div>
          <div className="w-full h-72 mt-6 bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  const getAllFreshCases = () => {
    let total = 0;
    creditManagerDisbursals?.forEach(disbursal => {
      total += disbursal['Fresh Cases'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      total += disbursal['Fresh Cases'];
    });
    return total;
  };

  const getAllFreshDisbursal = () => {
    let total = 0;
    creditManagerDisbursals?.forEach(disbursal => {
      total += disbursal['Fresh Disbursal Amount'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      total += disbursal['Fresh Disbursal Amount'];
    });
    return total;
  };

  const getAllReloanCases = () => {
    let total = 0;
    creditManagerDisbursals?.forEach(disbursal => {
      total += disbursal['Reloan Cases'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      total += disbursal['Reloan Cases'];
    });
    return total;
  };

  const getAllReloanDisbursal = () => {
    let total = 0;
    creditManagerDisbursals?.forEach(disbursal => {
      total += disbursal['Reloan Disbursal Amount'];
    });
    loanOfficerDisbursals?.forEach(disbursal => {
      total += disbursal['Reloan Disbursal Amount'];
    });
    return total;
  };

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex-col flex">
          <Title>Fresh vs Reloan Disbursal</Title>
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
        <TableHead>
          <TableRow className="bg-slate-400">
            <TableHeaderCell className="text-white">
              Sanction Officer
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Fresh Cases
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Fresh Disbursal
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Reloan Cases
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Reloan Disbursal
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Total Cases
            </TableHeaderCell>
            <TableHeaderCell className="text-white">
              Total Disbursal
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {creditManagerDisbursals?.map(disbursal => (
            <TableRow key={disbursal.name}>
              <TableCell>{disbursal.name}</TableCell>
              <TableCell>{disbursal['Fresh Cases']}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Fresh Disbursal Amount'])}
              </TableCell>
              <TableCell>{disbursal['Reloan Cases']}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Reloan Disbursal Amount'])}
              </TableCell>
              <TableCell>
                {disbursal['Fresh Cases'] + disbursal['Reloan Cases']}{' '}
              </TableCell>
              <TableCell>
                {formatIndianNumber(
                  disbursal['Fresh Disbursal Amount'] +
                    disbursal['Reloan Disbursal Amount'],
                )}
              </TableCell>
            </TableRow>
          ))}
          {loanOfficerDisbursals?.map(disbursal => (
            <TableRow key={disbursal.name}>
              <TableCell>{disbursal.name}</TableCell>
              <TableCell>{disbursal['Fresh Cases']}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Fresh Disbursal Amount'])}
              </TableCell>
              <TableCell>{disbursal['Reloan Cases']}</TableCell>
              <TableCell>
                {formatIndianNumber(disbursal['Reloan Disbursal Amount'])}
              </TableCell>
              <TableCell>
                {disbursal['Fresh Cases'] + disbursal['Reloan Cases']}{' '}
              </TableCell>
              <TableCell>
                {formatIndianNumber(
                  disbursal['Fresh Disbursal Amount'] +
                    disbursal['Reloan Disbursal Amount'],
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-500 text-white">
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>{getAllFreshCases()}</b>
            </TableCell>
            <TableCell>
              <b>{formatIndianNumber(getAllFreshDisbursal())}</b>
            </TableCell>
            <TableCell>
              <b>{getAllReloanCases()}</b>
            </TableCell>
            <TableCell>
              <b>{formatIndianNumber(getAllReloanDisbursal())}</b>
            </TableCell>
            <TableCell>
              <b>{getAllFreshCases() + getAllReloanCases()}</b>
            </TableCell>
            <TableCell>
              <b>
                {formatIndianNumber(
                  getAllFreshDisbursal() + getAllReloanDisbursal(),
                )}
              </b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

export default DisbursalReloanFreshTable;
