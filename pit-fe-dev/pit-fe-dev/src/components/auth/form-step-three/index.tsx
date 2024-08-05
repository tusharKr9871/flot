import { Dispatch, SetStateAction, useState } from "react";
import { format, parseISO } from "date-fns";
import { Divider } from "@tremor/react";
import PrimaryCTA from "@/components/primary-cta";
import SecondaryCTA from "@/components/secondary-cta";
import { axiosInstance } from "@/network/axiosInstance";
import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContextProvider";
import { useFormContext } from "@/context/FormContextProvider";
import * as Sentry from "@sentry/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const FormStepThree = ({
  setFormStep,
  // setCustomerId,
}: {
  setFormStep: Dispatch<SetStateAction<number>>;
  setCustomerId: Dispatch<SetStateAction<string>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [checked, setIsChecked] = useState("false");
  // const { revalidateToken } = useAuth();
  const { formState, setFormState } = useFormContext();
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source");
  const userId = searchParams.get("user");
  const gclid = localStorage.getItem("gclid");
  const cookieConsent = localStorage.getItem("cookie-consent");

  const onSubmit = async () => {
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("mobile", formState.phoneNo);
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("pancard", formState.pan);
      formData.append("aadharNo", formState.aadhaar);
      formData.append("monthlyIncome", formState.monthlyIncome.replaceAll("₹",""));
      formData.append("loanRequeried", formState.loanAmountRequired.replaceAll("₹",""));
      formData.append("dob", format(parseISO(formState.dob), "yyyy-MM-dd"));
      formData.append("gender", formState.gender);
      formData.append("city", formState.city);
      formData.append("state", formState.state);
      formData.append("pincode", formState.pincode);
      formData.append("utm_source", utmSource ? utmSource : "website");
      formData.append("purpose", formState.purpose ? formState.purpose : "others");
      formData.append("user", userId ? userId : "");
      formData.append("gclid", cookieConsent ? (gclid ? gclid : "") : "");
      // formData.append("clientId", process.env.NEXT_PUBLIC_CLIENT_ID);

      await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_PHP_BASE_URL}index.php`, formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // localStorage.setItem("token", response.data.token);
      toast.success("Submitted successfully!");
      // revalidateToken(response.data.token);
      setLoading(false);
        setFormStep(4);
        setFormState({
          phoneNo: "",
          name: "",
          email: "",
          pan: "",
          aadhaar: "",
          monthlyIncome: "",
          loanAmountRequired: "",
          dob: "",
          gender: "",
          purpose: "",
          state: "",
          city: "",
          pincode: "",
        });
    } catch (error) {
      Sentry.captureException(error);
      setLoading(false);
      toast.error("Mobile/Email Exist for this Pan/Aadhaar!");
    }
  };

  return (
    <div className="pt-12 md:w-3/4 w-full h-full flex flex-col justify-between">
      <div className="grid md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-6">
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Phone Number
          </label>
          <span className="text-black xs:text-sm text-base">
            +91 {formState.phoneNo}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Name
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.name}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Email
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.email}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            PAN
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.pan}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Aadhaar
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.aadhaar}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Monthly Income
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.monthlyIncome}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Loan Required
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.loanAmountRequired}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Date of Birth
          </label>
          <span className="text-black xs:text-sm text-base">
            {format(parseISO(formState.dob), "dd-MM-yyyy")}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Gender
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.gender}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            City
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.city}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            State
          </label>
          <span>{formState.state}</span>
        </div>
        <div className="flex flex-col">
          <label className="block xs:text-sm text-base font-medium text-gray-700/[0.6] mb-2">
            Pincode
          </label>
          <span className="text-black xs:text-sm text-base">
            {formState.pincode}
          </span>
        </div>
      </div>
      <div className="pb-8">
        <Divider />
        <div className="flex items-start mb-4">
          <input
            id="default-checkbox"
            type="checkbox"
            value="true"
            onChange={(e) => setIsChecked(e.target.checked.toString())}
            className="w-4 h-4 text-secondaryColor bg-gray-100 border-gray-300 rounded-lg"
          />
          <label
            htmlFor="default-checkbox"
            className="block xs:text-sm text-xs font-medium text-gray-700/[0.6] ml-2"
          >
            Click here to indicate that you have read and agree to the terms
            presented in the{" "}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bold text-black"
            >
              &quot;Terms and Conditions&quot;
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bold text-black"
            >
              &quot;Privacy Policy&quot;
            </Link>
          </label>
        </div>
      </div>
      <div>
        <div className="flex flex-row w-full items-center justify-between pt-6">
          <SecondaryCTA
            ctaText="Back"
            icon="back"
            onClick={() => setFormStep(1)}
            disabled={!!loading}
          />
          <PrimaryCTA
            ctaText="Submit"
            icon="next"
            loading={loading}
            disabled={checked !== "true" || !!loading}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStepThree;
