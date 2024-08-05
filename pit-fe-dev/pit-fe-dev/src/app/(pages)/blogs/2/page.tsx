import Image from "next/image";
import Blog2 from "../../../../../public/blog-2.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          How CIBIL Score Is Essential For Lending
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
          Sometimes, you need a long and short-term loan to fulfil your
          financial goals. About short-term loan goals may include home
          renovation, shopping needs, paying your monthly debts, etc. A
          short-term loan is an ideal funding option to address these goals.
          Therefore, a short-term loan and financial institutions look at a
          specific part of the parameters to gauge your creditworthiness.
          Improving a CIBIL score is one of the most significant before applying
          for any loan.
        </p>
        <p className="text-lg mb-4">
          CIBIL is a 3-digit number indicator of your financial credit history,
          ranging between 300 and 900 because this score considers one of the
          best scores according to all financial lenders and banks. It works
          because financial institutions provide you with a loan, which makes a
          credit report comprising your credit score.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          The Amount Of Loan And Interest
        </h4>
        <p className="text-lg mb-4">
          The loan amount you will receive depends on your CIBIL score. You can
          get a high-value short-term loan amount within a few hours after
          applying on Paisaintime’s official website. It is the only company you
          will get an instant short-term loan without any collateral. Also, a
          high credit score takes you in a top position to negotiate interest
          rates offered on the short-term loan amount.
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
        <h4 className="font-medium text-2xl my-8 text-black">
          Approval Of Loan Application
        </h4>
        <p className="text-lg mb-4">
          Your approval of a loan application depends on your credit score, and
          it is the first thing financial lenders and banks check when you send
          your request for a loan application. Financial lenders are more
          inclined to approve and disburse loans to candidates with excellent
          credit scores. Therefore, they might be doubtful and consider your
          loan amount application if your CIBIL score for lending is low.
        </p>
        <p className="text-lg mb-4">
          Apart from these, also some other beneficial points of having a good
          credit score like:
        </p>
        <p className="text-lg mb-4">
          Nowadays, many landlords and societies house owners request credit
          checks before agreeing to rent out a place to applicants.
        </p>
        <p className="text-lg mb-4">
          Several furniture rental firms also perform credit checks before
          providing you with their furniture on rent. Maintaining a good credit
          score would ensure that you get a good offer from the furniture store
        </p>
        <p className="text-lg mb-4">
          It is suitable for you before applying for a loan online, and it is
          pretty advisable to check your credit score to be more prepared for
          future transactions easily.{" "}
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">Conclusion</h4>
        <p className="text-lg mb-4">
          The above information is quite helpful for you, and not all can
          predict a financial crisis may occur because a short-term loan could
          benefit you in your financial situation. The short-term loans are
          collateral-free, and the only way to avail of one is with a higher
          CIBIL score. Paisaintime provides you with an instant short-term loan
          in a few hours with less paperwork.
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
