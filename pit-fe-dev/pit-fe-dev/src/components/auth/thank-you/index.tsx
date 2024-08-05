import Image from "next/image";
import Completed from "../../../../public/completed.svg";
// import PrimaryCTA from "@/components/primary-cta";
import { useRouter } from "next/navigation";
import SecondaryCTA from "@/components/secondary-cta";
import Script from "next/script";

const Thankyou = ({ customerId }: { customerId: string }) => {
  const router = useRouter();
  customerId
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-10815102397"
      />
      <Script
        id="google-ads"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-10815102397'); 
            `,
        }}
      />
      <Script
        id="google-ads-conversion"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('event', 'conversion', {'send_to': 'AW-10815102397/XjhlCPLv3LgDEL27haUo'});
          `,
        }}
      />
      <div className="pt-8 md:w-1/2 xs:w-3/4 w-full h-full flex flex-col justify-center items-center">
        <p className="xs:text-5xl text-4xl font-medium mb-10">Thank you!</p>
        <div className="xs:h-72 xs:w-72 h-52 w-52">
          <Image
            alt="completed-form"
            src={Completed}
            width={0}
            height={0}
            sizes="100vw"
          />
          <a href="https://storyset.com/work" className="hidden">
            Work illustrations by Storyset
          </a>
        </div>
        <div className="my-10 flex flex-col items-center">
          <p className="text-2xl font-medium">
            Thank you for submitting your application.
          </p>
          <p className="text-gray-600 text-lg mt-4">
            Our team will be contacting you in 15 minutes.
          </p>
          <div className="mt-14 flex-col xs:flex-row flex xs:items-center items-start justify-center">
            <p className="text-gray-600 text-lg mt-4">
              You can also check the status of your application in your
              dashboard or go back home.
            </p>
            <div className="mt-4 xs:mt-0"></div>
          </div>
          <div className="mt-4 w-full flex-col xs:flex-row flex xs:items-center items-start">
            {/* <PrimaryCTA
              ctaText="Dashboard"
              onClick={() => router.replace(`/customer_profile/${customerId}`)}
              viewStyle="mb-4 xs:mb-0 xs:mr-4"
            /> */}
            <SecondaryCTA ctaText="Home" onClick={() => router.replace(`/`)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Thankyou;
