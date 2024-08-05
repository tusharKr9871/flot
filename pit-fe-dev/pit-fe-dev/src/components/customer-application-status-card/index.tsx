"use client";

import {
  useFetchCustomerApplicationDetails,
  useFetchCustomerApplicationHistory,
} from "@/hooks/customer-api";
import { Card, Metric, Subtitle, Title } from "@tremor/react";
import classNames from "classnames";
import {
  TbCheck,
  TbChecklist,
  TbFileLike,
  TbMoneybag,
  TbX,
} from "react-icons/tb";
import PrimaryCTA from "../primary-cta";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { formatIndianNumber } from "@/utils/util-functions";

const CustomerApplicationStatusCard = () => {
  const { customerApplicationData, isFetchingCustomerApplicationData } =
    useFetchCustomerApplicationDetails();

  const {
    customerApplicationHistoryData,
    isFetchingCustomerApplicationHistoryData,
  } = useFetchCustomerApplicationHistory();

  const router = useRouter();

  if (
    isFetchingCustomerApplicationData ||
    isFetchingCustomerApplicationHistoryData
  ) {
    return (
      <Card className="px-6 basis-2/4 lg:ml-10 md:ml-6 mt-10 md:mt-0 animate-pulse">
        <div className="mb-4">
          <div className="mb-10">
            <Title>Application Status</Title>
            <Subtitle className="mt-4">Application No</Subtitle>
            <p className="text-sm text-gray-600 mt-2 font-medium animate-pulse h-2 w-12"></p>
          </div>
          <div className="animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full w-12 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 mb-4"></div>
          </div>
        </div>
      </Card>
    );
  } else if (!customerApplicationData) {
    return (
      <Card className="px-6 basis-2/4 lg:ml-10 md:ml-6 mt-10 md:mt-0">
        <div className="mt-4 h-full w-full flex flex-col justify-center items-center rounded-lg">
          <>
            <Metric className="text-gray-600">
              No application submitted yet!
            </Metric>
            <p className="my-4 text-gray-500 text-sm">Click below to apply</p>
          </>
          <PrimaryCTA ctaText="Apply" onClick={() => router.push("/reapply")} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-6 basis-2/4 lg:ml-10 md:ml-6 mt-10 md:mt-0">
      <div className="mb-4">
        <Title>Application Status</Title>
        <Subtitle className="mt-4 text-xs font-medium">Application No</Subtitle>
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {customerApplicationData.id}
        </p>
        <Subtitle className="mt-4 text-xs font-medium">Loan Required</Subtitle>
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {customerApplicationData.loanAmountRequired}
        </p>
        <Subtitle className="mt-4 text-xs font-medium">
          Application Status
        </Subtitle>
      </div>
      <ol className="relative text-gray-600 border-l border-gray-400 ml-4">
        <li className="mb-10 ml-8">
          <span className="absolute flex items-center justify-center w-8 h-8 bg-green-400 rounded-full -left-4 ring-4 ring-gray-100">
            <TbCheck className="text-gray-100" />
          </span>
          <h3 className="font-medium leading-tight">Applied</h3>
          {customerApplicationData.stepsCompleted >= 1 ? (
            <p className="text-sm">Verification Completed</p>
          ) : (
            <p className="text-sm">Verification in Progress</p>
          )}
        </li>
        <li className="mb-10 ml-8">
          <span
            className={classNames(
              "absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-gray-100",
              customerApplicationData.stepsCompleted >= 1 && "bg-green-400",
              customerApplicationData.stepsCompleted === -1 && "bg-red-400"
            )}
          >
            {customerApplicationData.stepsCompleted >= 1 ? (
              <TbCheck className="text-gray-100" />
            ) : customerApplicationData.stepsCompleted === -1 ? (
              <TbX className="text-gray-100" />
            ) : (
              <TbFileLike />
            )}
          </span>
          <h3 className="font-medium leading-tight">
            {customerApplicationData.stepsCompleted === -1
              ? "Rejected"
              : "Approved"}
          </h3>
          <p className="text-sm">
            {customerApplicationData.stepsCompleted === -1
              ? "Sorry, seems your application has been rejected"
              : "Approved for Disbursal"}
            {customerApplicationData.stepsCompleted >= 1 && (
              <p className="text-sm font-medium mb-2">
                {customerApplicationData.stepsCompleted >= 2 &&
                  `Amount Approved: ${formatIndianNumber(
                    customerApplicationData.approvalAmount
                  )}`}
              </p>
            )}
          </p>
        </li>
        <li className="mb-10 ml-8">
          <span
            className={classNames(
              "absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-gray-100",
              customerApplicationData.stepsCompleted >= 2 && "bg-green-400"
            )}
          >
            {customerApplicationData.stepsCompleted >= 2 ? (
              <TbCheck className="text-gray-100" />
            ) : (
              <TbMoneybag />
            )}
          </span>
          <h3 className="font-medium leading-tight">Disbursed</h3>
          <p className="text-sm">Loan amount credited</p>
          <p className="text-sm mb-1">
            {customerApplicationData.stepsCompleted >= 2 &&
              `Repayment Amount Till ${format(
                new Date(),
                "dd-MM-yyyy"
              )}: ${formatIndianNumber(
                customerApplicationData.repayAmountTillNow
              )}`}
          </p>
          <p className="text-sm font-medium mb-1">
            {customerApplicationData.stepsCompleted >= 2 &&
              `Total Repayment Amount: ${formatIndianNumber(
                customerApplicationData.repaymentAmount
              )}`}
          </p>
          <p className="text-sm font-medium text-red-400">
            {customerApplicationData.stepsCompleted >= 2 &&
              `Repay Date: ${format(
                parseISO(customerApplicationData.repayDate),
                "dd-MM-yyyy"
              )}`}
          </p>
        </li>
        <li className="ml-8 flex flex-row justify-between items-center">
          <div className="basis-1/2">
            <span
              className={classNames(
                "absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-white",
                customerApplicationData.stepsCompleted >= 3 && "bg-green-400"
              )}
            >
              {customerApplicationData.stepsCompleted >= 3 ? (
                <TbCheck className="text-gray-100" />
              ) : (
                <TbChecklist />
              )}
            </span>
            <h3 className="font-medium leading-tight">Closed</h3>
            <p className="text-sm">Case closed.</p>
          </div>
          <div className="flex items-end flex-col">
            <PrimaryCTA
              ctaText="Reloan"
              onClick={() => router.push("/reapply")}
              icon="reloan"
              disabled={
                (customerApplicationData.status !== "Closed" &&
                  customerApplicationData.status !== "Rejected" &&
                  customerApplicationData.status !== "No_Answer" &&
                  customerApplicationData.status !== "Duplicate") ||
                (customerApplicationHistoryData &&
                  customerApplicationHistoryData.at(0)?.status !== "Closed" &&
                  customerApplicationHistoryData.at(0)?.status !== "Rejected" &&
                  customerApplicationHistoryData.at(0)?.status !==
                    "Not_Eligible" &&
                  customerApplicationHistoryData.at(0)?.status !==
                    "Duplicate" &&
                  customerApplicationHistoryData.at(0)?.status !== "No_Answer")
              }
            />
          </div>
        </li>
      </ol>
    </Card>
  );
};

export default CustomerApplicationStatusCard;
