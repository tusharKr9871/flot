"use client";

import { Section } from "../section";
import Image from "next/image";
import FillForm from "../../../public/form.svg";
import EligibilityCheck from "../../../public/check.svg";
import DocumentCheck from "../../../public/documents.svg";
import Approval from "../../../public/approve.svg";
import { useInView } from "react-intersection-observer";
import classNames from "classnames";
import "animate.css/animate.css";

const LoanFlow = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <Section
      title="Get your loan in just 4 steps"
      description="The money will be in your account after you completed your application and we have carried out our checks."
      styling="bg-fontColorPrimary"
      titleStyling="text-primaryColor"
      descriptionStyling="text-white"
    >
      <div
        className={classNames(
          "flex flex-col justify-center",
          inView && "animate__animated animate__fadeInUp"
        )}
        ref={ref}
      >
        {/* mobile view */}
        <ol className="items-center pt-24 flex sm:flex-row flex-col justify-end w-full">
          <li className="relative mb-6 sm:mb-0 flex flex-1 flex-col sm:basis-1/4 w-full">
            <div className="flex items-center">
              <div className="mt-3 pr-8 sm:hidden">
                <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                  Apply Loan
                </h3>
                <p className="lg:text-base text-sm font-normal text-white">
                  Fastest Loan Approvals
                </p>
              </div>
              <div className="z-10 flex bg-primaryColor items-center justify-center w-24 h-24 rounded-full ring-gray-200 ring-8 shrink-0">
                <Image
                  alt="fill form"
                  src={FillForm}
                  width={0}
                  height={0}
                  sizes="50vw"
                />
              </div>
              <div className="hidden sm:flex w-full bg-gray-100 h-1"></div>
            </div>
          </li>
          <li className="relative mb-6 sm:mb-0 flex flex-1 flex-col sm:basis-1/4 w-full">
            <div className="flex items-center">
              <div className="hidden sm:flex w-full bg-gray-100 h-1"></div>
              <div className="z-10 flex bg-primaryColor items-center justify-center w-24 h-24 rounded-full ring-gray-200 ring-8 shrink-0">
                <Image
                  src={EligibilityCheck}
                  width={0}
                  height={0}
                  sizes="50vw"
                  alt="eligibility check"
                />
              </div>
              <div className="mt-3 pl-8 sm:hidden">
                <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                  Eligibility Check
                </h3>
                <p className="lg:text-base text-sm font-normal text-white">
                  Hassle free mechanism
                </p>
              </div>
              <div className="hidden sm:flex w-full bg-gray-100 h-1"></div>
            </div>
          </li>
          <li className="relative mb-6 sm:mb-0 flex flex-1 flex-col sm:basis-1/4 w-full">
            <div className="flex items-center">
              <div className="hidden sm:flex w-full bg-gray-100 h-1"></div>
              <div className="mt-3 pr-8 sm:hidden">
                <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                  Document Collection
                </h3>
                <p className="lg:text-base text-sm font-normal text-white">
                  Online document collection
                </p>
              </div>
              <div className="z-10 flex bg-primaryColor items-center justify-center w-24 h-24 rounded-full ring-gray-200 ring-8 shrink-0">
                <Image
                  src={DocumentCheck}
                  width={0}
                  height={0}
                  sizes="50vw"
                  alt="doc check"
                />
              </div>
              <div className="hidden sm:flex w-full bg-gray-100 h-1"></div>
            </div>
          </li>
          <li className="relative mb-6 sm:mb-0 flex flex-col sm:items-end text-end justify-end sm:basis-1/4 w-full">
            <div className="z-0 absolute sm:flex hidden left-0 top-[46px] w-full bg-gray-100 h-1"></div>
            <div className="flex items-center ">
              <div className="z-10 flex bg-primaryColor items-center justify-center w-24 h-24 rounded-full ring-gray-200 ring-8 shrink-0">
                <Image
                  src={Approval}
                  width={0}
                  height={0}
                  sizes="50vw"
                  alt="approval check"
                />
              </div>
              <div className="mt-3 pl-8 sm:hidden">
                <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                  Loan Approval
                </h3>
                <p className="lg:text-base text-sm font-normal text-white">
                  Quick loan disbursment
                </p>
              </div>
            </div>
          </li>
        </ol>
        {/* Desktop view */}
        <ol className="sm:flex justify-end w-full hidden">
          <li className="relative mb-6 sm:mb-0 flex flex-1 basis-1/4 flex-col">
            <div className="mt-3 sm:pr-8">
              <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                Apply Loan
              </h3>
              <p className="lg:text-base text-sm font-normal text-white">
                Fastest Loan Approvals
              </p>
            </div>
          </li>
          <li className="relative text-center items-center mb-6 sm:mb-0 flex flex-1 basis-1/4 flex-col">
            <div className="mt-3">
              <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                Eligibility Check
              </h3>
              <p className="lg:text-base text-sm font-normal text-white">
                Hassle free mechanism
              </p>
            </div>
          </li>
          <li className="relative text-center items-center mb-6 sm:mb-0 flex flex-1 basis-1/4 flex-col">
            <div className="mt-3">
              <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                Document Collection
              </h3>
              <p className="lg:text-base text-sm first-line:font-normal text-white">
                Online document collection
              </p>
            </div>
          </li>
          <li className="relative  mb-6 sm:mb-0 flex flex-col items-end text-end justify-start basis-1/4">
            <div className="mt-3">
              <h3 className="lg:text-lg text-base font-semibold text-primaryColor">
                Loan Approval
              </h3>
              <p className="lg:text-base text-sm font-normal text-white">
                Quick loan disbursment
              </p>
            </div>
          </li>
        </ol>
      </div>
    </Section>
  );
};

export { LoanFlow };
