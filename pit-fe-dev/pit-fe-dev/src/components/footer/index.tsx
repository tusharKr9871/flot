import Link from "next/link";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoYoutube,
} from "react-icons/io5";

const Footer = () => (
  <footer className="bg-fontColorPrimary">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
      <div className="md:flex md:justify-between">
        <div className="grid grid-cols-2 sm:gap-10 sm:grid-cols-4">
          <div className="">
            <h2 className="mb-6 text-lg font-semibold text-primaryColor">
              Follow Us
            </h2>
            <ul className="text-white font-medium xs:mr-0 xs:mb-0 mr-2 mb-2">
              <li className="mb-4">
                <li>
                  <p className="font-normal text-sm">
                GROWING BHARAT FINTECH PRIVATE LIMITED (Formerly known as Sawalsha Leasing & Finance Pvt Ltd) is a Non Banking Finance Company (NBFC) registered with the Reserve Bank of India (RBI). Paisaintime is the brand name under which the company conducts its lending operations and specialises in meeting customer’s instant financial needs.
                  </p>
                </li>
                <li>
                  <p className="font-normal xs:text-sm text-xs">Corporate Identity No. (CIN) U74899DL1994PTC057431 </p>
                </li>
                <li className="mb-4">
                   <p className="font-normal xs:text-sm text-xs">RBI Certificate of Registration No (CoR): B.14.02743 </p>
                </li>
                <div className="flex flex-row">
                  <a
                    href="https://www.facebook.com/paisaintime"
                    className="text-white hover:text-primaryColor mr-4"
                  >
                    <IoLogoFacebook className="xs:h-6 xs:w-6 h-4 w-4" />
                    <span className="sr-only">Facebook page</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/paisaintime"
                    className="text-white hover:text-primaryColor mr-4"
                  >
                    <IoLogoLinkedin className="xs:h-6 xs:w-6 h-4 w-4" />
                    <span className="sr-only">Linked In</span>
                  </a>
                  <a
                    href="https://www.instagram.com/paisaintime/"
                    className="text-white hover:text-primaryColor mr-4"
                  >
                    <IoLogoInstagram className="xs:h-6 xs:w-6 h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCyUv73DGib-jdpkev7DeE-Q"
                    className="text-white hover:text-primaryColor mr-4"
                  >
                    <IoLogoYoutube className="xs:h-6 xs:w-6 h-4 w-4" />
                    <span className="sr-only">Youtube</span>
                  </a>
                </div>
              </li>
              <li>
                <p className="font-semibold xs:text-base text-sm">Open Hours</p>
              </li>
              <li>
                <p className="font-normal xs:text-base text-sm">
                  Mon – Sat: 10:00 am to 6:30 pm Sunday: Closed
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-lg font-semibold text-primaryColor">
              Quick Links
            </h2>
            <ul className="text-white font-medium">
              <li className="mb-4">
                <a href="/" className="hover:underline xs:text-base text-sm">
                  Home
                </a>
              </li>
              <li className="mb-4">
                <Link
                  href="/repay"
                  className="hover:underline xs:text-base text-sm"
                >
                  Repay Loan
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/blogs"
                  className="hover:underline xs:text-base text-sm"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-lg font-semibold text-primaryColor">
              Help & Support
            </h2>
            <ul className="text-white font-medium">
              <li className="mb-4">
                <Link
                  href="/privacy-policy"
                  className="hover:underline xs:text-base text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/disclaimer"
                  className="hover:underline xs:text-base text-sm"
                >
                  Disclaimer
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/refund-policy"
                  className="hover:underline xs:text-base text-sm"
                >
                  Refund Policy
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/terms-and-conditions"
                  className="hover:underline xs:text-base text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/grievance"
                  className="hover:underline xs:text-base text-sm"
                >
                  Grievance
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  href="/apply"
                  className="hover:underline xs:text-base text-sm"
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>
          <div className="">
            <h2 className="mb-6 text-lg font-semibold text-primaryColor">
              Contact Info
            </h2>
            <ul className="text-white font-medium">
              <li>
                <p className="font-semibold xs:text-sm text-xs">Registered Address :</p>
              </li>
              <li className="mb-4">
                <p className="font-normal xs:text-sm text-xs">
                    520, Somdutt Chamber-2
                    9, Bhikaji Cama Place .New Delhi South Delhi, 110066 IN
                </p>
              </li>
              <li>
                <p className="font-semibold xs:text-sm text-xs">Address :</p>
              </li>
              <li className="mb-4">
                <p className="font-normal xs:text-sm text-xs">
                  Office No - 1003 & 1004, 10th Floor, Surya Kiran Building, K.G
                  Marg, Connaught Place, Delhi 110001
                </p>
              </li>
              <li>
                <p className="font-semibold xs:text-sm text-xs">Email :</p>
              </li>
              <li className="mb-4">
                <p className="font-normal xs:text-sm text-xs">
                  info@paisaintime.com
                </p>
              </li>
              <li>
                <p className="font-semibold xs:text-sm text-xs">Phone :</p>
              </li>
              <li className="mb-4">
                <p className="font-normal xs:text-sm text-xs">011-4446-7882</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div className="sm:flex flex-col justify-center items-center">
        <div className="flex flex-col text-center mb-6">
          <h2 className="mb-6 text-lg font-semibold text-primaryColor">
            Our Service Locations
          </h2>
          <div>
            <p className="font-normal text-white xs:text-base text-sm">
              Hyderabad | Bengaluru | Pune | Chennai | Mumbai | Kolkata | Delhi
              | Noida | Gurgaon
            </p>
          </div>
        </div>
        <div>
          <span className="text-white sm:text-center xs:text-sm text-xs">
            © {new Date().getFullYear()}{" "}
            <a href="https://growingbharat.com/" className="hover:underline">
              Growing Bharat Fintech Private Limited (Formerly known as Sawalsha
              Leasing and Finance Private Limited)
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };
