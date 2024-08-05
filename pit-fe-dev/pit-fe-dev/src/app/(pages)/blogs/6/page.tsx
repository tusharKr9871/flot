import Image from "next/image";
import Blog2 from "../../../../../public/blog-6.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          What’s A Good Credit Score For Easy Loan Approval?
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
          TransUnion CIBIL Limited (Formerly Credit Information Bureau India
          Limited) is the most popular credit information company in India and
          one of the four credit information companies authorized by the Reserve
          Bank of India. The CIBIL score is a 3 digit numeric status of your
          credit health summarised by your credit history, rating, and report.
          The score is displayed in the range of 300-900. A CIBIL score check
          denotes your creditworthiness and higher your score, the better are
          your chances of loan approval at preferential interest rates. A loan
          is an of unsecured loan that is for a short or medium-term period. It
          can be taken for several reasons such as a for a vacation, paying off
          debt, medical expenses, and wedding expenses, among others.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Minimum CIBIL score for loan eligibility and its importance
        </h4>
        <p className="text-lg mb-4">
          The RBI allows CIBIL to keep track of all your borrowing and
          prepayment conditioning with banks, credit card companies and other
          registered lenders. CIBIL also tracks whether you’re making timely
          disbursements or missing the due dates; the quantum of credit you’re
          exercising out of your credit limit; and whether you have increased
          your credit card’s limit. Also, it maintains a record of your loans or
          credit card operations in the recent history.
        </p>
        <p className="text-lg mb-4">
          All these criteria and parameters impact your credit score and the
          minimal CIBIL score for loan eligibility. A good credit score should
          be in the range of 750-900 but lenders may consider you loan good
          indeed if your credit score is in the range of 650-700, handed you
          fulfill many other conditions. For illustration, if you have a stable
          job, enjoy home, and have no negative credit history, you may get a
          loan without meeting the minimal CIBIL score for particular loan.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Minimum CIBIL score for a loan
        </h4>
        <p className="text-lg mb-4">
          Lenders prefer someone with a minimal CIBIL score for a loan of 700
          and when it comes to the minimal CIBIL score for a particular loan, a
          score of 750 is preferred since a loan is a relaxed loan. Some banks
          may offer you a loan if your CIBIL credit score is below 750, handed
          you have no negative credit history. Lenders consider credit history
          as negative if you haven’t made timely disbursements in the once or
          defaulted on loans or credit card payments.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          loan with a low credit score
        </h4>
        <p className="text-lg mb-4">Credit Scores between 300-599</p>
        <p className="text-lg mb-4">
          A credit score from 300 to 599 is viewed as poor by any lender. It
          shows the terrible record of the candidate and the non-feasibility of
          the payment. Thus, most lenders will dismiss the individual’s request
          for a loan. Such candidates should go to lengths to work on his/her
          financial assessment to gain admittance to loans or credit cards.
        </p>
        <p className="text-lg mb-4">Credit Scores between 600-749</p>
        <p className="text-lg mb-4">
          A financial assessment going from 600 to 749 is viewed as low however
          not generally so unsafe as referenced previously. There are numerous
          banks that might decide to disregard this score and give individual
          advances to the candidate in light of different variables like,
        </p>
        <p className="text-lg mb-4">
          Sound reimbursement limit of the candidate
        </p>
        <p className="text-lg mb-4">
          Confirmation of pay presented by the candidate
        </p>
        <p className="text-lg mb-4">Credit against any security or insurance</p>
        <p className="text-lg mb-4">Business history</p>
        <p className="text-lg mb-4">Relationship with the bank</p>
        <p className="text-lg mb-4">
          Regardless of whether you’ve conceded a loan, the rate of interest on
          it will be higher and the credit terms may not be great for the
          borrower.
        </p>
        <p className="text-lg mb-4">Credit Scores over 750</p>
        <p className="text-lg mb-4">
          Anything north of 750 is viewed as great by every moneylender for
          loans. The candidate can likewise get different benefits with a decent
          financial assessment like better loan costs, higher advance sum,
          higher residency, lower handling charges, and so forth.
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
