"use client";

import { useEffect, useState } from "react";
import FormStepper from "../form-stepper";
import FormStepOne from "./form-step-one";
import FormStepTwo from "./form-step-two";
import FormStepThree from "./form-step-three";
import Thankyou from "./thank-you";
import { Card } from "@tremor/react";
import { useSearchParams } from "next/navigation";

const Auth = () => {
  const [formStep, setFormStep] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const searchParams = useSearchParams();
  const gclid = searchParams.get("gclid");

  useEffect(() => {
    if (gclid !== null) {
      localStorage.setItem("gclid", gclid);
    }
  }, [gclid]);

  return (
    <div className="flex lg:flex-row flex-col flex-1">
      <div className="lg:basis-3/4 sm:basis-4/5 basis-full flex flex-col items-center bg-white sm:px-12 px-6 py-4 pt-16">
        {formStep === 4 ? (
          <Thankyou customerId={customerId} />
        ) : (
          <>
            {" "}
            <h2 className="sm:text-4xl text-3xl font-medium text-fontColorPrimary">
              Apply Loan
            </h2>
            <div
              className={`mt-4 sm:text-lg text-base md:px-20 text-fontColorSecondary pb-10`}
            >
              Get your loan in 3 simple steps!
            </div>
            <FormStepper formStep={formStep} />
            {formStep === 0 && <FormStepOne setFormStep={setFormStep} />}
            {formStep === 1 && <FormStepTwo setFormStep={setFormStep} />}
            {formStep === 2 && (
              <FormStepThree
                setFormStep={setFormStep}
                setCustomerId={setCustomerId}
              />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col basis-1/5 lg:basis-1/4 items-center justify-center bg-fontColorPrimary pt-12">
        <p className="text-white font-medium text-xl md:text-lg px-6 mb-10">
          Get Instant Loan Up-to 2 Lakh, Just in One Click
        </p>
        <Card className="bg-white rounded-lg px-8 py-4 mb-8 w-[90%] text-center flex flex-row items-center justify-between">
          <p className="text-white text-base bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center">
            1
          </p>
          <p className="text-primaryColor text-lg">100% Online Process</p>
        </Card>

        <Card className="bg-white rounded-lg px-8 py-4 mb-8 w-[90%] text-center flex flex-row items-center justify-between">
          <p className="text-white text-base bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center">
            2
          </p>
          <p className="text-primaryColor text-lg">Get Money in 2 Hours</p>
        </Card>
        <Card className="bg-white rounded-lg px-8 py-4 mb-8 w-[90%] text-center flex flex-row items-center justify-between">
          <p className="text-white text-base bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center">
            3
          </p>
          <p className="text-primaryColor text-lg">No Collateral Required</p>
        </Card>
        <Card className="bg-white rounded-lg px-8 py-4 mb-8 w-[90%] text-center flex flex-row items-center justify-between">
          <p className="text-white text-base bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center">
            4
          </p>
          <p className="text-primaryColor text-lg">Lowest Interest Rate</p>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

{
  /* <div className="lg:h-72 lg:w-72 md:h-40 md:w-40 sm:h-32 sm:w-32 items-center">
          {formStep === 0 && (
            <Image
              alt="enter-otp"
              src={OTP}
              width={0}
              height={0}
              sizes="100vw"
            />
          )}
          {formStep === 1 && (
            <Image
              alt="enter-personal-details"
              src={Form}
              width={0}
              height={0}
              sizes="100vw"
            />
          )}
          {formStep === 2 && (
            <Image
              alt="summary"
              src={Summary}
              width={0}
              height={0}
              sizes="100vw"
            />
          )}
          <a href="https://storyset.com/work" className="hidden">
            Work illustrations by Storyset
          </a>
        </div>
        <div className="text-center px-4">
          <p className="text-white font-medium text-xl md:text-lg">
            {formStep === 0
              ? "Verify your Phone number"
              : formStep === 1
              ? "Fill out your information"
              : "Almost There!"}
            <br />
            <span className="text-sm md:text-xs font-normal">
              {formStep === 0
                ? "You will recieve an OTP that you need to enter to proceed!"
                : formStep === 1
                ? "This is required to start processing your loan"
                : "Review your information and proceed."}
            </span>
          </p>
        </div> */
}
