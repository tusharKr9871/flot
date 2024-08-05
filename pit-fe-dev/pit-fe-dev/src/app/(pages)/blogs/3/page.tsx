import Image from "next/image";
import Blog2 from "../../../../../public/blog-3.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          What Is Digital Lending? 5 Tips To Keep In Mind
        </h2>
        <p>By Nidhi Sharma</p>
        <div className="w-full flex items-center justify-center my-16">
          <div className="h-[350px] w-[700px]">
            <Image
              alt="blog-image"
              src={Blog2}
              width={0}
              height={0}
              sizes="100vw"
              quality={80}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <p className="text-lg mb-4">
          Digital lending refers to the online mode of disbursal of loans. The
          entire process from loan approval to recovery takes place remotely,
          typically through mobile apps and websites. Technology is rapidly
          growing in the financial sector in India with automation and easy
          accessibility. This has given the financial sector power to grow and
          the opportunity to innovate the lending processes and disbursement
          processes. Even the people have easily adapted to digital channels to
          get instant, personalized, superior, and secure services. During the
          pandemic, people have adapted to digital lending because of its online
          interface of the application, disbursal, and contactless features.
        </p>
        <h3 className="font-medium text-3xl mt-8 mb-4 text-black">
          Five Important Things That A Consumer Needs To Know About Digital
          Lending:
        </h3>
        <h4 className="font-medium text-2xl mb-4 text-black">
          Eligibility Criteria Of Borrowers
        </h4>
        <p className="text-lg mb-4">
          Before applying for a loan, a customer should check the eligibility
          criteria of different digital lending websites and apps. One must
          verify that they meet the standards set by the digital platform. If a
          customer cannot meet these details and gets rejected from the lenders,
          again and again, it will affect their CIBIL scores too. According to
          RBI, lenders must check for the CIBIL score of every loan/credit card
          applicant at the time of evaluation. The CIBIL score decides the
          creditworthiness and ranges from 300 to 900.
        </p>
        <p className="text-lg mb-4">
          People seeking loans need to upload bank statements, address and ID
          proof, and photographs for applying for loans. Keeping these documents
          in hand helps you complete the online loan application process within
          a few minutes. Most digital lending platforms do the KYC verification
          digitally through your original documents submitted on the app/
          website.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Plan Your Finances In Advance
        </h4>
        <p className="text-lg mb-4">
          A planned budget helps a person to live systematically and well within
          the means. On the other hand, unplanned expenditure can raise the debt
          levels even before one realizes what’s happening.
        </p>
        <p className="text-lg mb-4">
          Planning your repayment is also important in case of any type of loan.
          Use an online loan monthly installment (EMI) calculator to know more
          about the monthly installments by filling in your interest rate and
          the amount required.
        </p>
        <p className="text-lg mb-4">
          Before taking any loan, borrowers can have the details of the EMI,
          like how much they need to pay in a month and how many months they
          need to pay, and plan their budget accordingly. If the EMI seems high
          to be able to repay comfortably, you can consider the option of taking
          a loan of a lesser amount that falls within your comfort repayment
          zone.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Safety Standards
        </h4>
        <p className="text-lg mb-4">
          Digital lending companies are very conscious about the matters related
          to the safety and security of people’s information and are
          continuously working to find the best solutions for the customers and
          gain their trust. Such measures help build good relations between the
          digital lender and the customers.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Read All The Terms And Conditions
        </h4>
        <p className="text-lg mb-4">
          Before clicking ‘I agree’ on every box, one must carefully read all
          the terms and conditions. It will give all the minute details and
          prevent any miscommunication that may arise. Just carefully read all
          the terms and conditions before signing up for a loan application
          online to avoid any surprises in the future.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Maintain A Good Credit Score
        </h4>
        <p className="text-lg mb-4">
          A credit score by CIBIL shows your creditworthiness as a loan seeker.
          Lenders can know about your credit history via this credit score, and
          only after that are, they convinced they would be ready to lend you
          money. With the help of a credit score, they determine if the person
          can default and anticipate the level of risk involved.
        </p>
        <p className="text-lg mb-4">
          Having a good credit score will aid in getting high credit with a
          low-interest rate, while a weak one will bring a high-interest rate on
          loans taken. Hence it is advisable to maintain a good credit score.
          This can be done by regularly paying your EMIs and clearing credit
          card dues every month.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">Conclusion</h4>
        <p className="text-lg mb-4">
          Financial institutions have been experimenting and adopting new
          technologies for a long time. The fintech institutions offer a wide
          range of products to build your portfolio and investment journey. It
          is easy to use, paperless, and hassle-free. The new techniques have
          simplified the process of lending and made getting a loan easier for
          customers
        </p>
      </div>
      <div className="basis-1/3 mb-12">
        <h2 className="text-5xl font-medium">Recent Posts</h2>
        <div className="mt-4 flex flex-col">
          <Link href="/blogs/1" className="text-secondaryColor text-lg">
            Why short term loan is better than borrowing money from others
          </Link>
          <Link href="/blogs/2" className="text-secondaryColor text-lg mt-4">
            How CIBIL Score Is Essential For Lending
          </Link>
          <Link href="/blogs/3" className="text-secondaryColor text-lg mt-4">
            What Is Digital Lending? 5 Tips To Keep In Mind
          </Link>
          <Link href="/blogs/4" className="text-secondaryColor text-lg mt-4">
            How To Get An Instant Loan Without Any Credit History
          </Link>
          <Link href="/blogs/5" className="text-secondaryColor text-lg mt-4">
            Manage Your Unplanned Charges With An Affordable Loan
          </Link>
          <Link href="/blogs/6" className="text-secondaryColor text-lg mt-4">
            What’s A Good Credit Score For Easy Loan Approval?
          </Link>
          <Link href="/blogs/7" className="text-secondaryColor text-lg mt-4">
            Boost Your Chances For An Instant Loan Approval
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
