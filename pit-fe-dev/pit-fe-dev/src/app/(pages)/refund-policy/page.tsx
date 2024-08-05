import { Section } from "@/components/section";

const RefundPolicy = () => (
  <Section title="Refund Policy" styling="pt-28">
    <div>
      <p className="text-base text-gray-700 text-justify">
        At Paisaintime we value our customers and are committed to providing the
        best service. The refund process will only be initiated by Paisaintime
        under the following conditions:
      </p>
      <p className="text-2xl font-medium text-fontColorPrimary mt-4">
        We will not pass your details on to any third party.
      </p>
      <ul className="mt-4">
        <li>
          <p className="text-base text-gray-700 text-justify">
            • If repayment of the loan has been done by the borrower twice by
            any means.
          </p>
        </li>
        <li>
          <p className="text-base text-gray-700 text-justify mt-4">
            • Any extra payment has been received by Paisaintime over and above
            the repayment value in any case.
          </p>
        </li>
        <li>
          <p className="text-base text-gray-700 text-justify mt-4">
            • Repayment has been done mistakenly by the borrower unintentionally
            before his/her the due date of loan repayment.
          </p>
        </li>
      </ul>
      <p className="text-base text-gray-700 text-justify mt-4">
        If, for unforeseen reasons, the client is not satisfied with our
        services, they can call us for advice on future calls. We will do our
        best to increase satisfaction in such cases. We strongly encourage our
        visitors and potential customers to read the refund policy before making
        a payment. If the customer is entitled to a refund, the refund amount
        will be credited to the respective bank account within 7 working days.
      </p>
    </div>
  </Section>
);

export default RefundPolicy;
