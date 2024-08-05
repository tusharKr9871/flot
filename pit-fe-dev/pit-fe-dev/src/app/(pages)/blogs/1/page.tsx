import Image from "next/image";
import Blog1 from "../../../../../public/blog-1.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          Why Short-Term Loan Is Better Than Borrowing Money From Others
        </h2>
        <p>By Nidhi Sharma</p>
        <div className="w-full flex items-center justify-center my-16">
          <div className="h-[350px] w-[700px]">
            <Image
              alt="blog-image"
              src={Blog1}
              width={0}
              height={0}
              sizes="100vw"
              quality={80}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <p className="text-lg mb-4">
          Every person at some time or the other borrows money from their
          friends, relatives, and family members, especially in emergency needs.
          Sometimes, borrowing money from others is pretty embarrassing. Hence
          it may be a better idea to look for a short-term loan for emergency
          needs because a short-term loan is one of the best solutions for
          self-employed and salaried persons. Borrowing money online from
          Paisaintime is one of the safest procedures, and you will get instant
          cash into your bank account.
        </p>
        <p className="text-lg mb-4">
          short-term loan have received many bad reviews in the last few years.
          The main reason was the high-interest rate, administrative fees, and
          other extra charges, but a short-term loan is a viable option to get
          out of your financial trouble. Here are a few reasons why you should
          go for a short-term loan.
        </p>
        <h4 className="font-medium text-2xl mb-4 text-black">No Awkwardness</h4>
        <p className="text-lg mb-4">
          Borrowing from friends may get you out of a crisis, but it is a burden
          you have to bear until the loan is repaid. If there is a little bit of
          delay or you are not in good condition to meet your commitment, it
          becomes awkward even to meet the person or talk to them. The
          Short-Term Loan will be best suitable for you, and you are entirely in
          a secure zone. After taking a short-term loan, you can plan your other
          expenses, optimize your EMI and fit them into your monthly budget
          without any inconvenience.
        </p>
        <h4 className="font-medium text-2xl mb-4 text-black">
          Clear Transaction Terms
        </h4>
        <p className="text-lg mb-4">
          Getting a short-term loan from family, friends, or relatives without
          any paperwork depends on trust and is not documented. The terms and
          conditions are equivocal. The money is borrowed on a faith basis
          without any documentation and promises to return shortly. If you are
          taking loan money from a financial lender or bank, you are fully aware
          of the criteria and period.
        </p>
        <p className="text-lg mb-4">
          Several people are aware nowadays of repaying the loan via monthly
          payments. If you are taking a loan from family, friends, and
          relatives, there is no such return policy and discipline, and hence
          you may be under pressure to pay it back 0early. And if you can’t it
          can be very embarrassing.
        </p>
        <h4 className="font-medium text-2xl mb-4 text-black">
          Payback In Easy EMIs
        </h4>
        <p className="text-lg mb-4">
          A Short-Term Loan can be paid quickly in an EMIs without extra charges
          and easily fit your budget by adjusting the tenure. Repay the loan in
          full after six months without any prepayment penalty. On the other
          hand, borrowing a loan from your friends or relative is usually
          repayable in a lump sum amount with no exact date. Suppose your
          friends or relatives ask for the money, and if your condition is not
          good, then it will be the worst situation for anyone to handle.
        </p>
        <h4 className="font-medium text-2xl mb-4 text-black">Conclusion</h4>
        <p className="text-lg mb-4">
          The repayment plan is according to your convenience. Repay the loan in
          six months EMIs without any extra charges or fines. Borrowing from
          friends and family is a bad idea, and always better to use a standard
          option for your short-term loan and maintain your relationships. Get
          your short-term loan from Paisaintime within a few hours and at
          low-interest rates.
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
