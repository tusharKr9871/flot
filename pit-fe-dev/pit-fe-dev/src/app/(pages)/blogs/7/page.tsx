import Image from "next/image";
import Blog2 from "../../../../../public/blog-7.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          Boost Your Chances For An Instant Loan Approval
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
          Handling your financial responsibilities, regardless of whether they
          are to optimize your kitchen or to pay off your credit card bills can
          prove to be costly. In such a situation opting for an instant loan
          online can prove to be beneficial.
        </p>
        <p className="text-lg mb-4">
          Loans are mostly unsecured loans i.e they do not require any
          collaterals or pledge any asset to secure a loan. This is what makes
          an instant loan an attractive financing option. Since these are
          unsecured in nature, lenders rely on different factors to determine
          the creditworthiness of the borrower. This is why it is crucial to be
          in a strong financial position when applying for an online instant
          loan.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          5 useful tips for boosting your eligibility for a loan are:
        </h4>
        <p className="text-lg mb-4">
          1. Include all your income sources: The repaying capacity of a person
          is determined by the lender. Because of this, all your sources of
          income and additional income, if any should be included to determine
          your eligibility to apply for an instant loan.
        </p>
        <p className="text-lg mb-4">
          2. Reduce debt-to-income ratio: To lower off the debt-to-income ratio,
          timely repayments of existing loans and credit card payments can prove
          to be beneficial before applying for an instant loan. The present
          credit card dues and debts may make one appear credit hungry,
          hindering your chances to apply for a loan.
        </p>
        <p className="text-lg mb-4">
          3. Enhancing and maintaining the Credit Score: A person’s
          qualification for an instant loan depends upon the credit score of the
          borrower. The higher your score is, the better are your chances to get
          a loan. A credit score of 800 or more is considered to be good. A
          score less than 800 is considered to be a high-risk borrower.
        </p>
        <p className="text-lg mb-4">
          4. Make sure you fulfill the eligibility criteria: A loan application
          can be rejected if the eligibility criteria is not met. That is why it
          is recommended to double-check the loan eligibility criteria before
          opting for a loan. If you are in urgent need of funds then you can
          instantly apply with PAISAINTIME as they offer easy eligibility
          criteria with instant approvals for loans up to Rs. 1 lakh with
          minimum documentation.
        </p>
        <p className="text-lg mb-4">
          5. Avoid applying for multiple loans: When a borrower is applying for
          a loan, lenders raise an inquiry with the Credit Bureau to determine
          your creditworthiness. These inquiries are considered to be hard
          inquiries making the applicant seem credit hungry which in turn makes
          him a high-risk borrower. This is why it is best to evaluate your
          options before applying for an online instant loan.
        </p>
        <p className="text-lg mb-4">
          6. Borrow the right loan amount: The amount that the loan is required
          for should be borrowed only as much is needed. Being offered a large
          loan amount does not require you to take it. The larger the amount is,
          the more interest is levied on it. This is why assessing needs before
          applying for a loan amount is crucial.
        </p>
        <p className="text-lg mb-4">
          By fulfilling these conditions one just has to get their essential
          documents verified in order to complete the loan sanctioning process.
          <span className="text-secondaryColor">
            <Link href="https://paisaintime.com/apply">Apply Now</Link>
          </span>
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
