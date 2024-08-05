import Image from "next/image";
import Blog2 from "../../../../../public/blog-5.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          Manage Your Unplanned Charges With An Affordable Loan
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
          If you have unplanned expenses or an emergency that requires funding,
          loans can be an effective solution. Whether you have an emergency
          medical bill to pay for or want to renovate your home, loans are a
          good solution. They are available to anyone and can even be accessed
          online.
        </p>
        <p className="text-lg mb-4">
          Still, there are lots of people who hesitate to apply for a loan due
          to its high-interest rate and complex terms. But this is a myth, loans
          are not expensive provided you fulfill the eligibility criteria and
          have a good credit score. The conditions and terms of the loan are
          very flexible.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          The factors that define the eligibility criteria are –
        </h4>
        <p className="text-lg mb-4">
          • Your age • type of employment • your employer • your yearly income •
          your CIBIL score • your debt-to-income rate • your arrears
        </p>
        <p className="text-lg mb-4">
          There are different eligibility criteria for different banks and if
          you meet those, you’ll get approved for the loan at a lower and
          further affordable rate.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Safety And Security
        </h4>
        <p className="text-lg mb-4">
          Paying your EMI on time shows that you have repaid all your loans
          amount on time without hassle-free; also, it assures lenders that you
          will continue doing the same in the future and you are one trustworthy
          person. Your creditworthiness to repay the loan is the priority for
          banks and financial lenders to instantly grant the loan amount to your
          bank account.
        </p>
        <p className="text-lg mb-4">
          Helpful tips to get a particular loan at lower rates –
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          1. Include all income sources
        </h4>
        <p className="text-lg mb-4">
          It’s important to expose all your income sources to the lender as the
          particular loan is a relaxed collateral-free loan. The lender has to
          assess the repayment capability of the client by taking into account
          rudiments like income, job history, etc. These help in knowing the
          fiscal situation of the client.
        </p>
        <p className="text-lg mb-4">
          The addition of all income sources in addition to the regular payment
          or business income helps in giving further confidence to the lender
          about the repayment capability of the client. Fresh income sources
          like income from a side business, rental income, etc help in making a
          more robust profile for the client.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          2. Maintain a good credit score
        </h4>
        <p className="text-lg mb-4">
          It’s important to have a good credit score to get a particular loan at
          a lower rate. A credit score reflects your credit profile by way of a
          three-number numeric number that can range from 300 to 900. A score
          over 750 is good enough to get you a particular loan at a competitive
          rate from a reputed lender.
        </p>
        <p className="text-lg mb-4">
          Several furniture rental firms also perform credit checks before
          providing you with their furniture on rent. Maintaining a good credit
          score would ensure that you get a good offer from the furniture store
        </p>
        <p className="text-lg mb-4">
          You need to maintain a good credit score as it helps in getting a
          particular loan at competitive rates from a lender. The advanced the
          score, the better are your chances of getting a loan at a low-interest
          rate from a lender.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          3. Include a co-borrower
        </h4>
        <p className="text-lg mb-4">
          It’s always better to rope in a co-applicant or a co-borrower on your
          loan operation. By adding a co-borrower, you aren’t only suitable to
          add to the overall eligibility, but you can also get a good deal at a
          better interest rate.
        </p>
        <p className="text-lg mb-4">
          A co-applicant to your loan operation can be a family member or a
          friend. By a co-applicant that also has a strong credit record, a
          lender’s confidence is increased and you can get the loan approved at
          better terms and interest rates.
        </p>
        <p className="text-lg mb-4">
          The primary idea of adding a co-applicant to a particular loan is to
          increase the probability of prepayment of the loan. The co-applicant
          provides a further guarantee of prepayment in case the borrower
          defaults on the loan because of any reason.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          4. Conclude for the right lender
        </h4>
        <p className="text-lg mb-4">
          A loan is offered by several banks and NBFCs and you can select the
          ideal lender according to the interest rates offered. It’s inversely
          important to consider factors like service, delivery, other charges,
          etc to finalize a lender. All these measures help in making the
          experience of taking a particular loan for an unplanned expenditure
          more affordable.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          5. Conclude for part- payments
        </h4>
        <p className="text-lg mb-4">
          A particular loan is anticipated to be paid off in EMIs with interest
          to the lender. It’s important to try and make part- payments as and
          when you have fat finances. By making regular part payments, you would
          be suitable to get your star down over a period and reduce your
          overall interest outgo on the particular loan.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          6. Keep a strong track record
        </h4>
        <p className="text-lg mb-4">
          It’s veritably important to maintain a strong track record and pay all
          EMIs on time. Any gaps in payment of EMIs may not only attract charges
          from the lender which will increase your charges further but also
          impact your credit score. Thus, it’s important to keep a strong
          payment record with the lender and continue to pay the outstanding
          EMIs on time.
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
