"use client";

import { useFetchCustomerApplicationHistory } from "@/hooks/customer-api";
import { formatIndianNumber } from "@/utils/util-functions";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { format, parseISO } from "date-fns";

const CustomerApplicationHistoryCard = () => {
  const {
    customerApplicationHistoryData,
    isFetchingCustomerApplicationHistoryData,
  } = useFetchCustomerApplicationHistory();

  const getApplicationStatus = (stepsCompleted: number) => {
    switch (stepsCompleted) {
      case -1:
        return "Rejected";
      case 3:
        return "Closed";
      default:
        return "Pending";
    }
  };

  if (isFetchingCustomerApplicationHistoryData) {
    return (
      <Card className="px-4 w-full animate-pulse">
        <Title>Application History</Title>
        <div className="flex flex-row flex-1 mt-4">
          <div className="flex flex-col mr-4 flex-1">
            <span className="text-xs font-medium text-gray-500 mb-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-4"></div>
            </span>
          </div>
          <div className="flex flex-col mr-4 flex-1">
            <span className="text-xs font-medium text-gray-500 mb-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-4"></div>
            </span>
          </div>
          <div className="flex flex-col mr-4 flex-1">
            <span className="text-xs font-medium text-gray-500 mb-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-4"></div>
            </span>
          </div>
          <div className="flex flex-col mr-4 flex-1">
            <span className="text-xs font-medium text-gray-500 mb-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-4"></div>
            </span>
          </div>
          <div className="flex flex-col mr-4 flex-1">
            <span className="text-xs font-medium text-gray-500 mb-1">
              <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-4"></div>
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-4 w-full">
      <Title className="px-4 mb-4">Application History</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Application No</TableHeaderCell>
            <TableHeaderCell>Loan No</TableHeaderCell>
            <TableHeaderCell>Amount Required</TableHeaderCell>
            <TableHeaderCell>Amount Approved</TableHeaderCell>
            <TableHeaderCell>Repayment Amount</TableHeaderCell>
            <TableHeaderCell>Repayment Date</TableHeaderCell>
            <TableHeaderCell>Collected Amount</TableHeaderCell>
            <TableHeaderCell>Purpose</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Apply Date</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerApplicationHistoryData?.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.id}</TableCell>
              <TableCell>{data.loanNo}</TableCell>
              <TableCell>{data.loanAmountRequired}</TableCell>
              <TableCell>{formatIndianNumber(data.approvedAmount)}</TableCell>
              <TableCell>{formatIndianNumber(data.repaymentAmount)}</TableCell>
              <TableCell>
                {format(parseISO(data.repaymentDate), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>{formatIndianNumber(data.collectedAmount)}</TableCell>
              <TableCell>{data.purpose}</TableCell>
              <TableCell>
                <Badge
                  color={
                    getApplicationStatus(data.stepsCompleted) === "Rejected"
                      ? "red"
                      : getApplicationStatus(data.stepsCompleted) === "Closed"
                      ? "emerald"
                      : "yellow"
                  }
                >
                  {getApplicationStatus(data.stepsCompleted)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(parseISO(data.createdAt), "dd-MM-yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default CustomerApplicationHistoryCard;
