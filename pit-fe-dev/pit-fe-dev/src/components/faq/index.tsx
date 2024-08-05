"use client";

import { useState } from "react";
import { Section } from "../section";
import classNames from "classnames";
import "animate.css/animate.min.css";
import { FAQs } from "@/constants/faq";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  //@ts-ignore
  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <Section title="Frequently Asked Questions" styling="bg-gray-200">
      <div>
        {FAQs.map((item, index) => (
          <div key={index} className="mb-8">
            <div
              className={classNames(
                "flex items-center justify-between p-4 bg-white shadow-md cursor-pointer animate__animated animate__fadeIn",
                openIndex === index ? "rounded-t-lg" : "rounded-lg"
              )}
              onClick={() => toggleAccordion(index)}
            >
              <span className="sm:text-xl text-lg font-medium text-fontColorPrimary">
                {item.title}
              </span>
              <svg
                className={`w-5 h-5 transition-transform transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
            {openIndex === index && (
              <div className="p-4 bg-white border border-gray-300 rounded-b-lg animate__animated animate__fadeIn">
                <p className="sm:text-xl text-lg text-light">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export { FAQ };
