"use client";

import { Section } from "../section";
import Image from "next/image";
import Calculation from "../../../public/calculation.svg";
import { IoChevronForwardCircle } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import classNames from "classnames";
import "animate.css/animate.css";

const LoanSampleCalculation = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <Section
      title="Sample Loan Calculation"
      description="This is an example calculation for a loan of ₹30,000 for 90 days at 30% interest rate."
      styling="bg-fontColorPrimary pb-12"
      titleStyling="text-primaryColor"
      descriptionStyling="text-white"
    >
      <div
        className={classNames(
          "flex flex-col justify-between",
          inView && "animate__animated animate__fadeInRight"
        )}
        ref={ref}
      >
        <div className="mt-4 flex flex-row flex-1">
          <div className="flex-1 flex justify-start items-center">
            <div className="flex flex-col items-start justify-center flex-1">
              <div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Loan Amount :{" "}
                    <span className="text-primaryColor font-medium">
                      ₹30,000 at Interest rate of 30% p.a.
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Loan Duration :{" "}
                    <span className="text-primaryColor font-medium">
                      3 months
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Total loan interest :{" "}
                    <span className="text-primaryColor font-medium">
                      ₹ 2,250
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Processing fees (PF) + GST :{" "}
                    <span className="text-primaryColor font-medium">
                      ₹ 500 + ₹ 90 = ₹ 590
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Total Deductibles :{" "}
                    <span className="text-primaryColor font-medium">
                      (PF + GST) - ₹ 590
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    In-Hand Amount: Loan Amount - Total Deductibles ={" "}
                    <span className="text-primaryColor font-medium">
                      ₹ 30,000 - 590 = ₹ 29,410
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Total repayable Amount :{" "}
                    <span className="text-primaryColor font-medium">
                      (Loan Amount + Interest) - ₹ 32,250
                    </span>{" "}
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    Monthly EMI Repayable :{" "}
                    <span className="text-primaryColor font-medium">
                      (Loan Amount + Interest / No of EMI’s) - ₹ 10,750
                    </span>
                  </span>
                </div>
                <div className="flex flex-row items-center mb-4">
                  <IoChevronForwardCircle className="md:text-2xl text-xl text-white" />
                  <span className="ml-4 md:text-lg text-base font-light text-white">
                    PF + GST are deducted upfront during the loan disbursal.
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 sm:flex hidden justify-end items-center">
              <div className="md:h-96 md:w-96 sm:h-72 sm:w-72 items-center">
                <Image
                  alt="loan-criteria"
                  src={Calculation}
                  width={0}
                  height={0}
                  sizes="100vw"
                />
                <a href="https://storyset.com/work" className="hidden">
                  Work illustrations by Storyset
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export { LoanSampleCalculation };
