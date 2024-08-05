import Image from "next/image";
import Blog2 from "../../../../../public/blog-4.webp";
import Link from "next/link";

const Blog = () => {
  return (
    <div className="pt-28 mx-auto lg:px-32 px-8 flex lg:flex-row flex-col bg-white">
      <div className="lg:basis-2/3 basis-1 lg:mr-24 mb-16 text-gray-700">
        <h2 className="text-5xl font-medium text-black">
          How To Get An Instant Loan Without Any Credit History
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
          If your credit card is not so good, and you are going to apply for a
          loan without any credit history, then it will be tough for you because
          credit card history is quite mandatory for a bank and other financial
          lenders. After all, many ways to step out with this bad credit score
          and plenty of valid reasons for not having a credit report. Usually,
          the need for a loan or credit card arises after a certain age, and due
          to this, several people opt for a loan, especially at a young age.
        </p>
        <p className="text-lg mb-4">
          You can apply for a short-term loan if you do not have any credit
          history, and now you are a little bit worried about getting a loan,
          but you do not have to worry about anything. Several banks and
          financial lenders quite understand the absence of credit history and
          consider it a valid reason. Therefore, it does not mean that they will
          give you all liberties. Let’s discuss some other points.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Become a co-applicant
        </h4>
        <p className="text-lg mb-4">
          Becoming a co-applicant is quite good for a bad credit card holder,
          and if someone has a good CIBIL score is willing to become a
          co-applicant for the loan, it might be good to change your bad credit
          history, but you have to be alert in such situations because becoming
          a co-applicant is not easy. Also, your co-applicant is equally
          responsible for the repayment of the loan amount. So, make sure that
          if they are unable to pay their loan EMIs, then they will be counted
          as a defaulter and their CIBIL score would be afflicted badly for
          future loans.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Apply for a new credit card
        </h4>
        <p className="text-lg mb-4">
          It is the simplest way to create your new credit history is by
          applying for a new credit card, but make sure that you are a working
          person if you want to get one immediately. Therefore, one particular
          thing that you should be careful always the credit usage of the card.
          Try to not surpass more than 30% of the credit limit provided to you
          on the card by the bank due to this it would be a huge negative impact
          on your credit score.
        </p>
        <p className="text-lg mb-4">
          If you are using a new credit card for a few months trying to pay all
          the bills before a time, then it might be able to create a credit
          history, due to this it would be easier for you to obtain a loan of
          your choice.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">
          Apply for an online loan service
        </h4>
        <p className="text-lg mb-4">
          Several people are nowadays applying for an online loan because an
          online loan is the best solution to grab a loan with no credit
          history. It is because many online loan providers and financial
          lenders are most active than traditional lenders. Many people believe
          that online loans are also more convenient and flexible than
          traditional loans, as long as you have a safe and adequately high
          income. Also, the best part is that you can easily check your
          eligibility criteria for an online loan offered by everyday loan India
          in a few hours with lower interest rates.
        </p>
        <h4 className="font-medium text-2xl my-8 text-black">Conclusion</h4>
        <p className="text-lg mb-4">
          Looking for a loan on an urgent basis, then you can go for an online
          loan because it is the most convenient and simple procedure to get a
          loan in a few hours. Everyday loan India has become a trustworthy
          company for online loan procedures. For more information visit our
          official website, where you can see all the basic information about
          short-term loans.
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
