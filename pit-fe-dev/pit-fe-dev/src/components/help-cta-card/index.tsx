"use client";

import { useInView } from "react-intersection-observer";
import "animate.css/animate.css";
import classNames from "classnames";

const HelpCTACard = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className="flex flex-col rounded-lg bg-fontColorPrimary p-4 text-center sm:flex-row sm:items-center sm:justify-between sm:p-12 sm:text-left shadow-lg"
    >
      <div className="sm:text-2xl text-xl font-semibold">
        <div
          className={classNames(
            "text-white",
            inView && "animate__animated animate__fadeIn"
          )}
        >
          Need any help regarding Repayment?
        </div>
        <div
          className={classNames(
            "text-primaryColor",
            inView && "animate__animated animate__fadeInUp"
          )}
        >
          Call our experts now
        </div>
      </div>
      <div
        className={classNames(
          "whitespace-no-wrap mt-3 sm:ml-2 sm:mt-0 items-center flex flex-col",
          inView && "animate__animated animate__fadeInRight"
        )}
      >
        <a
          className="bg-primaryColor flex items-center justify-center px-6 py-3 rounded-lg"
          href="tel:011-4446-7882"
        >
          <p className="text-white sm:text-lg text-sm font-medium">Call Now</p>
          {/* <TbPhone className="sm:h-6 sm:w-6 h-4 w-4 text-white ml-2" /> */}
        </a>
        <p className="text-white font-medium mt-4"> 011 4446 7882</p>
      </div>
    </div>
  );
};

export default HelpCTACard;
