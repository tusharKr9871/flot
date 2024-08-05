"use client";

import { Section } from "../section";
import Image from "next/image";
import Fast from "../../../public/fast-and-easy.svg";
import Control from "../../../public/control-over-policy.svg";
import QuickDisbursal from "../../../public/disbursal.svg";
import ProfessionalTeam from "../../../public/professional-team.svg";
import { useInView } from "react-intersection-observer";
import classNames from "classnames";

const WhyUs = () => {
  const [ref, inView] = useInView({ threshold: [0.01], triggerOnce: true });

  return (
    <Section
      title="Why Us?"
      description="We provide the fastest and easiest loan approvals with minimum documentation powered by a team of experienced professionals throughtout the country."
      styling="bg-white items-center"
    >
      <div
        className={classNames(
          "flex sm:flex-row flex-col justify-between pt-4 md:w-4/5 w-full items-center",
          inView && "animate__animated animate__fadeInLeft"
        )}
        ref={ref}
      >
        <div className="flex flex-col items-center justify-center max-w-54 sm:mb-0 mb-8">
          {/* <IoSpeedometerOutline className="h-10 w-10 mb-4 text-primaryColor" /> */}
          <span className="md:h-32 md:w-32 w-24 h-24">
            <Image
              alt="fast-and-easy"
              src={Fast}
              width={0}
              height={0}
              sizes="100vw"
            />
            <a href="https://storyset.com/work" className="hidden">
              Work illustrations by Storyset
            </a>
          </span>
          <span className="md:text-xl text-lg font-normal pt-2">
            Fast and easy process
          </span>
        </div>
        <div className="flex flex-col items-center justify-center max-w-54 sm:mb-0 mb-8">
          <span className="md:h-32 md:w-32 w-24 h-24">
            <Image
              alt="control-over-policy"
              src={Control}
              width={0}
              height={0}
              sizes="100vw"
            />
            <a href="https://storyset.com/work" className="hidden">
              Work illustrations by Storyset
            </a>
          </span>
          <span className="md:text-xl text-lg font-normal pt-2">
            Control over policy
          </span>
        </div>
        <div className="flex flex-col items-center justify-center max-w-54 sm:mb-0 mb-8">
          <span className="md:h-32 md:w-32 w-24 h-24">
            <Image
              alt="quick-disbursal"
              src={QuickDisbursal}
              width={0}
              height={0}
              sizes="100vw"
            />
            <a href="https://storyset.com/work" className="hidden">
              Work illustrations by Storyset
            </a>
          </span>
          <span className="md:text-xl text-lg font-normal pt-2">
            Quick Disbursal
          </span>
        </div>
        <div className="flex flex-col items-center justify-center max-w-54 sm:mb-0 mb-8">
          <span className="md:h-32 md:w-32 w-24 h-24">
            <Image
              alt="professional-team"
              src={ProfessionalTeam}
              width={0}
              height={0}
              sizes="100vw"
            />
            <a href="https://storyset.com/work" className="hidden">
              Work illustrations by Storyset
            </a>
          </span>
          <span className="md:text-xl text-lg font-normal pt-2">
            Professional Team
          </span>
        </div>
      </div>
    </Section>
  );
};

export { WhyUs };
