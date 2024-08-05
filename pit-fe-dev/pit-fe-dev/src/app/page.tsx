import { Blogs } from "@/components/blogs";
import { FAQ } from "@/components/faq";
import { Hero } from "@/components/hero";
import { LoanCriteria } from "@/components/loan-criteria";
import { LoanFlow } from "@/components/loan-flow";
import { LoanSampleCalculation } from "@/components/loan-sample-calculation";
import { RoundedBottom } from "@/components/rounded-bottom";
import { Testimonials } from "@/components/testimonials";
import { WhyUs } from "@/components/why-us";

export default function Home() {
  return (
    <div className="min-h-screen overflow-y-hidden">
      <Hero />
      <RoundedBottom />
      <WhyUs />
      <LoanFlow />
      <LoanCriteria />
      <LoanSampleCalculation />
      <Blogs />
      <Testimonials />
      <FAQ />
    </div>
  );
}
