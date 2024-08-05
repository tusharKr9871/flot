import Auth from "@/components/auth";
import CookieConsent from "@/components/cookie-consent";
import { LoanCriteria } from "@/components/loan-criteria";
import { LoanSampleCalculation } from "@/components/loan-sample-calculation";

const Apply = () => {
  return (
    <div className="flex flex-col pt-[4%] min-h-screen">
      <Auth />
      <CookieConsent />
      <div className="w-full">
        <LoanSampleCalculation />
        <LoanCriteria />
      </div>
    </div>
  );
};

export default Apply;
