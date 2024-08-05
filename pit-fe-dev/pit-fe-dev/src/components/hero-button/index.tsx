import type { ReactNode } from "react";
import "animate.css/animate.css";

type IHeroButtonProps = {
  title: ReactNode;
  description: string;
  button: ReactNode;
};

const HeroButton = (props: IHeroButtonProps) => (
  <header className="text-left">
    <h1 className="whitespace-pre-line lg:text-5xl md:text-4xl text-4xl font-medium leading-hero text-[#f5f5f5] animate__animated animate__fadeIn">
      {props.title}
    </h1>
    <div className="mb-8 mt-4 lg:text-2xl md:text-xl text-2xl animate__animated animate__fadeInUp text-gray-300">
      {props.description}
    </div>
    <div className="flex items-start justify-start animate__animated animate__fadeIn">
      {props.button}
    </div>
  </header>
);

export { HeroButton };
