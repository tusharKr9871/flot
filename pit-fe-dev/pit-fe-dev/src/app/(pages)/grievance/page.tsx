import { Section } from "@/components/section";

const Grievance = () => {
  return (
    <Section title="Grievance" styling="pt-28">
      <p className="text-2xl font-medium text-fontColorPrimary">
        Grievance Redressal Cell
      </p>
      <p className="text-base text-gray-700 text-justify mt-4">
        We strictly follow the RBI directive and have set up an effective
        Grievance Redressal Cell to handle and address all manner of grievances.
        We always endeavour to carry out responsible lending, whereby we give
        just the loan which we know you will find convenient to pay back, but
        also recover our dues ethically. We never believe in any manner of
        high-handed or coercive recovery methods. But in case you have any
        complaints we will take up the matter seriously and address the issue
        within 5 working days.
        <br />
        <br />
      </p>
      <div className="flex flex-col">
        <span className="hover:underline text-primaryColor">
          Email us at: grievance@growingbharat.com
        </span>
        <span className="hover:underline text-primaryColor">
          GRO: Pratibha Kumar
        </span>
        <a
          href="tel:928-938-3874"
          className="hover:underline text-primaryColor"
        >
          Phone no: +91 7428197660
        </a>
      </div>
    </Section>
  );
};

export default Grievance;
