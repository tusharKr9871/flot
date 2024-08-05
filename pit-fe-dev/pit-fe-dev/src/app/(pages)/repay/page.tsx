import { Section } from "@/components/section";
import Image from "next/image";
import QRPay from "../../../../public/payment.jpg";
import HelpCTACard from "@/components/help-cta-card";

const Repay = () => (
  <div>
    <Section
      title="QR Pay"
      styling="bg-fontColorPrimary pt-28 items-center"
      titleStyling="text-primaryColor"
      description="Scan the QR Code to repay via Google Pay / Phone Pay / Paytm / BHIM UPI apps."
      descriptionStyling="text-white"
    >
      <div className="h-1/2 w-1/2">
        <Image
          alt="payment-qr"
          src={QRPay}
          width={0}
          height={0}
          sizes="100vw"
        />
      </div>
    </Section>
    <Section
      title="Bank Details"
      description="Please Repay Your Payable Loan Amount Through The Following Bank"
    >
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded mt-8">
          <table className="w-full text-sm text-left text-gray-500">
            <tbody>
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Company Name
                </th>
                <td className="px-6 py-4 text-gray-700">
                  GROWING BHARAT FINTECH PRIVATE LIMITED (Formerly known as
                  Sawalsha Leasing and Finance Private Limited)
                </td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Bank Name
                </th>
                <td className="px-6 py-4 text-gray-700">ICICI Bank</td>
              </tr>
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Account Number
                </th>
                <td className="px-6 py-4 text-gray-700">054705002138</td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  IFSC Code
                </th>
                <td className="px-6 py-4 text-gray-700">
                  ICIC0000547 (used for RTGS, IMPS and NEFT transactions)
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Branch Name
                </th>
                <td className="px-6 py-4 text-gray-700">Vasant kunj</td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Account Type
                </th>
                <td className="px-6 py-4 text-gray-700">CURRENT</td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  UPI Payment
                </th>
                <td className="px-6 py-4 text-gray-700">SAWALSHA@icici</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Section>
    <Section
      title="Bank Details"
      styling="bg-fontColorPrimary"
      titleStyling="text-primaryColor"
      description="For RTGS, IMPS and NEFT Transactions"
      descriptionStyling="text-white"
    >
      <div>
        <div className="relative overflow-x-auto shadow-md sm:rounded mt-8">
          <table className="w-full text-sm text-left text-gray-500">
            <tbody>
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Company Name
                </th>
                <td className="px-6 py-4 text-gray-700">
                  GROWING BHARAT FINTECH PRIVATE LIMITED (Formerly known as
                  Sawalsha Leasing and Finance Private Limited)
                </td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Bank Name
                </th>
                <td className="px-6 py-4 text-gray-700">HDFC Bank</td>
              </tr>
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Account Number
                </th>
                <td className="px-6 py-4 text-gray-700">99997475881994</td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  IFSC Code
                </th>
                <td className="px-6 py-4 text-gray-700">HDFC0000003</td>
              </tr>
              <tr className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Branch Name
                </th>
                <td className="px-6 py-4 text-gray-700">
                  KG Marg, Connaught Place, Delhi 110001
                </td>
              </tr>
              <tr className="border-b bg-gray-200">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Account Type
                </th>
                <td className="px-6 py-4 text-gray-700">CURRENT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Section>
    <Section>
      <HelpCTACard />
    </Section>
  </div>
);

export default Repay;
