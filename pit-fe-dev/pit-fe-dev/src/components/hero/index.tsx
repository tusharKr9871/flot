"use client";

import Link from "next/link";
import Image from "next/image";

import { Background } from "../background";
import ApplyNowCTA from "../apply-now-cta";
import { HeroButton } from "../hero-button";
import { Section } from "../section";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { HeroData } from "@/constants/hero-button";

const Hero = () => (
  <Background color="bg-fontColorPrimary lg:h-[90vh] md:h-auto z-20">
    <Section yPadding="pt-40">
      <Carousel
        infiniteLoop={true}
        showStatus={false}
        autoPlay={true}
        showArrows={false}
        showThumbs={false}
      >
        {HeroData.map((hero) => (
          <div
            className="flex flex-col md:flex-row items-center pb-12"
            key={hero.id}
          >
            <div className="md:flex-1">
              <HeroButton
                title={
                  <>
                    {`${hero.text}\n`}
                    <span className="font-bold text-primaryColor">
                      {hero.highlightText}
                    </span>
                  </>
                }
                description={hero.description}
                button={
                  <Link href="/apply">
                    <ApplyNowCTA>Apply now</ApplyNowCTA>
                  </Link>
                }
              />
            </div>
            <div className="md:flex-1 hidden md:flex justify-center md:w-72 w-full md:h-[30rem]">
              <Image
                src={hero.image}
                alt="hero image"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </Carousel>
    </Section>
  </Background>
);

export { Hero };
