"use client";

import { Section } from "../section";
import Image from "next/image";
import Criteria from "../../../public/criteria.svg";
import { IoChevronForwardCircle } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import classNames from "classnames";
import "animate.css/animate.css";

const LoanCriteria = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <Section
      title="Loan Criteria"
      description="The following loan criteria is followed by us."
      styling="bg-gray-200 pb-12"
      titleStyling="text-fontColorPrimary"
    >
      <div
        className={classNames(
          "flex flex-col justify-between",
          inView && "animate__animated animate__fadeInLeft"
        )}
        ref={ref}
      >
        <div className="mt-4 flex flex-row flex-1">
          <div className="flex-1 sm:flex hidden justify-start items-center">
            <div className="md:h-96 md:w-96 sm:h-72 sm:w-72 items-center">
              <Image
                alt="loan-criteria"
                src={Criteria}
                width={0}
                height={0}
                sizes="100vw"
              />
              <a href="https://storyset.com/work" className="hidden">
                Work illustrations by Storyset
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center flex-1">
            <div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Loan Amount -{" "}
                  <span className="text-fontColorPrimary font-medium">
                    ₹40,000 to ₹2,00,000
                  </span>
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Interest Rate - Up to{" "}
                  <span className="text-fontColorPrimary font-medium">36%</span>{" "}
                  per annum
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  APR -{" "}
                  <span className="text-fontColorPrimary font-medium">
                    36% Max
                  </span>
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Age - 21 to 55 years
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Late payment fee - as applicable{" "}
                  <span className="text-sm font-medium text-gray-700">
                    ( Charged only, If repayment is delayed )
                  </span>
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Processing Fee - Up to{" "}
                  <span className="text-fontColorPrimary font-medium">5%</span>
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Loan tenure -{" "}
                  <span className="text-fontColorPrimary font-medium">
                    90 days
                  </span>{" "}
                  to{" "}
                  <span className="text-fontColorPrimary font-medium">
                    180 days
                  </span>
                </span>
              </div>
              <div className="flex flex-row items-center mb-4">
                <IoChevronForwardCircle className="md:text-2xl text-xl text-black" />
                <span className="ml-4 md:text-lg text-base font-light">
                  Pre-closure charges – As applicable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export { LoanCriteria };
