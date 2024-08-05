"use client";

import Image from "next/image";
import Form from "../../../public/fillout-form.svg";
import ReapplyFormStepOne from "./step-one";

export type FormStateType = {
  phoneNo: string;
  name: string;
  email: string;
  pan: string;
  aadhaar: string;
  monthlyIncome: number;
  loanAmountRequired: number;
  dob: Date;
  gender: string;
  purpose: string;
  state: string;
  city: string;
  pincode: string;
};

const ReApplyForm = () => {
  return (
    <div className="flex flex-1 flex-row h-auto">
      <div className="sm:flex hidden flex-col basis-1/5 lg:basis-1/4 items-center justify-center bg-fontColorPrimary">
        <div className="lg:h-72 lg:w-72 md:h-40 md:w-40 sm:h-32 sm:w-32 items-center">
          <Image
            alt="enter-personal-details"
            src={Form}
            width={0}
            height={0}
            sizes="100vw"
          />
          <a href="https://storyset.com/work" className="hidden">
            Work illustrations by Storyset
          </a>
        </div>
        <div className="text-center px-4">
          <p className="text-white font-medium text-xl md:text-lg">
            Fill out your information
            <br />
            <span className="text-sm md:text-xs font-normal">
              This is required to start processing your loan
            </span>
          </p>
        </div>
      </div>
      <div className="lg:basis-3/4 sm:basis-4/5 basis-full flex flex-col items-center bg-white sm:px-12 px-6 py-4 pt-16">
        <h2 className="sm:text-4xl text-3xl font-medium text-fontColorPrimary">
          Reapply for Loan
        </h2>
        <div
          className={`mt-4 sm:text-lg text-base md:px-20 text-fontColorSecondary pb-10`}
        >
          Reapply in 1 simple step
        </div>
        <ReapplyFormStepOne />
      </div>
    </div>
  );
};

export default ReApplyForm;
