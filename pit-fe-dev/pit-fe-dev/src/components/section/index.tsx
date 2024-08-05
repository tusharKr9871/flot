"use client";

import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import "animate.css/animate.css";
import classNames from "classnames";

type ISectionProps = {
  title?: string;
  description?: string;
  styling?: string;
  yPadding?: string;
  children: ReactNode;
  titleStyling?: string;
  descriptionStyling?: string;
};

const Section = (props: ISectionProps) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      className={`mx-auto lg:px-24 px-8 flex flex-col ${
        props.yPadding ? props.yPadding : "py-16"
      } ${props.styling}`}
      ref={ref}
    >
      {(props.title || props.description) && (
        <div className="mb-12 text-center">
          {props.title && (
            <h2
              className={classNames(
                `sm:text-4xl text-3xl font-medium text-fontColorPrimary ${props.titleStyling}`,
                inView && "animate__animated animate__fadeIn"
              )}
            >
              {props.title}
            </h2>
          )}
          {props.description && (
            <div
              className={classNames(
                `mt-4 sm:text-lg text-base md:px-20 text-fontColorSecondary ${props.descriptionStyling}`,
                inView && "animate__animated animate__fadeInUp"
              )}
            >
              {props.description}
            </div>
          )}
        </div>
      )}

      {props.children}
    </div>
  );
};

export { Section };
