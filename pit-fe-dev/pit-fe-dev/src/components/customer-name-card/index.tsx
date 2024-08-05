"use client";

import { useAuth } from "@/context/AuthContextProvider";
import { useFetchCustomer } from "@/hooks/customer-api";
import { aadhaarFormatter, getCustomerInitials } from "@/utils/util-functions";
import { Card } from "@tremor/react";
import { parseISO, format } from "date-fns";
import Image from "next/image";
import { TbUser } from "react-icons/tb";

const CustomerNameCard = () => {
  const { user } = useAuth();
  const { customerData, isFetchingCustomerData } = useFetchCustomer({
    userToken: user?.token || "",
  });

  if (isFetchingCustomerData || !customerData) {
    return (
      <Card className="basis-1/3">
        <div className="animate-pulse">
          <div className="flex flex-col items-start">
            <div className="h-24 w-24">
              <div className="rounded-full b-2 border-black h-full w-full bg-gray-600 flex items-center justify-center">
                <p className="text-white font-bold text-4xl">
                  <TbUser />
                </p>
              </div>
            </div>
            <div className="text-gray-600 flex-col flex text-2xl font-medium">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-3 bg-gray-200 rounded-full w-full mb-4"></div>
            </div>
          </div>
          <div className="w-1/2 pt-4">
            <div className="mb-8 mt-4">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-4/5 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="basis-1/3">
      <div className="flex flex-col items-start">
        <div className="h-24 w-24 relative">
          {/* <label
            className="absolute cursor-pointer hover:flex hover:bg-gray-200/[0.5] rounded-full h-full w-full items-center justify-center"
            onClick={uploadPfp}
            htmlFor="pfp-update"
          >
            <TbPencil className="h-8 w-8 hover:text-black text-transparent" />
            <input
              id="pfp-update"
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
            />
          </label> */}
          {customerData.customerPicture ? (
            <div className="rounded-full b-2 border-black h-full w-full flex items-center justify-center">
              <Image
                src={customerData.customerPicture}
                alt="customer-profile-picture"
                height={0}
                width={0}
                sizes="100vw"
                style={{
                  width: "100%",
                  borderRadius: "100%",
                  borderWidth: 1,
                  borderColor: "black",
                }}
              />
            </div>
          ) : (
            <div className="rounded-full b-2 border-black  h-full w-full bg-gray-600 flex items-center justify-center">
              <p className="text-white font-bold text-4xl">
                {getCustomerInitials(customerData.customerName || "")}
              </p>
            </div>
          )}
        </div>
        <p className="text-gray-600 flex-col flex text-2xl font-medium">
          <span className="text-lg text-gray-700 pt-6">Welcome back,</span>
          {customerData.customerName}
        </p>
      </div>
      <div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Email</p>
          <span className="flex flex-row items-center">
            <span className="text-sm font-medium mt-1">
              {customerData.email}
            </span>
          </span>
        </div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Phone No</p>
          <span className="flex flex-row items-center">
            <span className="text-sm font-medium mt-1">
              {customerData.phoneNo}
            </span>
          </span>
        </div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Gender</p>
          <p className="text-sm font-medium mt-1">{customerData.gender}</p>
        </div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">PAN</p>
          <p className="text-sm font-medium mt-1">{customerData.pan}</p>
        </div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Aadhaar</p>
          <p className="text-sm font-medium mt-1">
            {aadhaarFormatter(customerData.aadhar || "")}
          </p>
        </div>
        <div className="my-4">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Date of Birth
          </p>
          <p className="text-sm font-medium mt-1">
            {format(parseISO(customerData.dob), "dd-MM-yyyy")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CustomerNameCard;
