import { DisbursalReportType } from '@/hooks/reports-api';
import {
  enumCleaner,
  formatIndianNumber,
  selectPillColor,
} from '@/utils/utils';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { format, parseISO } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import Pagination from '../pagination';
import { TbEye } from 'react-icons/tb';
import Link from 'next/link';
import NoTableDataFound from '../no-table-data-found';
import { useAuth } from '@/context/AuthContextProvider';
import classNames from 'classnames';

const ReportsDisbursedDataTable = ({
  tableData,
  totalCount,
  pageNumber,
  setPageNumber,
}: {
  tableData: DisbursalReportType[];
  totalCount: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };
  const { user } = useAuth();

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="mt-4 h-[90%]">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">Loan Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">Full Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Gender</TableHeaderCell>
            <TableHeaderCell className="bg-white">DOB</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Personal Email
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Official Email
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Mobile</TableHeaderCell>
            <TableHeaderCell className="bg-white">Address</TableHeaderCell>
            <TableHeaderCell className="bg-white">City</TableHeaderCell>
            <TableHeaderCell className="bg-white">State</TableHeaderCell>
            <TableHeaderCell className="bg-white">Pincode</TableHeaderCell>
            <TableHeaderCell className="bg-white">Address Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Aadhar Number
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Pan Card</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Monthly Income
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Credited By</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approved Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Processing Fee
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">GST Fee</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Approval Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Amount
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Date
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Tenure</TableHeaderCell>
            <TableHeaderCell className="bg-white">ROI</TableHeaderCell>
            <TableHeaderCell className="bg-white">Account No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Account Type</TableHeaderCell>
            <TableHeaderCell className="bg-white">IFSC</TableHeaderCell>
            <TableHeaderCell className="bg-white">Bank</TableHeaderCell>
            <TableHeaderCell className="bg-white">Bank Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Disbursal Reference No.
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">CIBIL</TableHeaderCell>
            <TableHeaderCell className="bg-white">UTM Source</TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell>
                <Link
                  className="text-2xl cursor-pointer text-primaryColor"
                  href={`/customer_profile/${item.leadId}`}
                  target="_blank">
                  {user?.role !== 'Service' && <TbEye />}
                </Link>
              </TableCell>
              <TableCell>{item.loanNo}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>
                <Badge color={item.loanType === 'payday' ? 'orange' : 'green'}>
                  {item.loanType}
                </Badge>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{format(parseISO(item.dob), 'dd-MM-yyyy')}</TableCell>
              <TableCell>{item.personalEmail}</TableCell>
              <TableCell>{item.officeEmail}</TableCell>
              <TableCell>{item.mobile}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.state}</TableCell>
              <TableCell>{item.pincode}</TableCell>
              <TableCell>{item.addressCategory}</TableCell>
              <TableCell>{item.aadharNumber}</TableCell>
              <TableCell>{item.panCard}</TableCell>
              <TableCell>{formatIndianNumber(item.monthlyIncome)}</TableCell>
              <TableCell>{item.creditManager}</TableCell>
              <TableCell>{formatIndianNumber(item.loanAmount)}</TableCell>
              <TableCell>{formatIndianNumber(item.processingFee)}</TableCell>
              <TableCell>{formatIndianNumber(item.gstFee)}</TableCell>
              <TableCell>
                {format(parseISO(item.approvalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{formatIndianNumber(item.disbursalAmount)}</TableCell>
              <TableCell>
                {format(parseISO(item.disbursalDate), 'dd-MM-yyyy')}
              </TableCell>
              <TableCell>{item.tenure}</TableCell>
              <TableCell>{item.roi}%</TableCell>
              <TableCell>{item.accountNo}</TableCell>
              <TableCell>{item.accountType}</TableCell>
              <TableCell>{item.ifsc}</TableCell>
              <TableCell>{item.bank}</TableCell>
              <TableCell>{item.bankBranch}</TableCell>
              <TableCell>{item.disbursalReferenceNo}</TableCell>
              <TableCell>{item.cibil}</TableCell>
              <TableCell>{item.utmSource}</TableCell>
              <TableCell>
                <Badge color={selectPillColor(enumCleaner(item.status))}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row items-center">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalCount / 10) === 0 ? 1 : Math.ceil(totalCount / 10)
          }
          totalItems={totalCount}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ReportsDisbursedDataTable;
