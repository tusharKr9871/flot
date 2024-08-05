import DateInput from "@/components/date-input";
import PrimaryCTA from "@/components/primary-cta";
import SecondaryCTA from "@/components/secondary-cta";
import SelectInput from "@/components/select-input";
import TextInputContainer from "@/components/text-input";
import { BranchStates } from "@/constants/states";
import { getCityByState } from "@/utils/util-functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider } from "@tremor/react";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { LoanPurpose } from "@/constants/loan-purpose";
import { IncomeBrackets } from "@/constants/income-bracket";
import { LoanRequirementBrackets } from "@/constants/loan-requirement-brackets";
import { useFormContext } from "@/context/FormContextProvider";

type PersonalDetailsFormType = {
  name: string;
  email: string;
  pan: string;
  aadhaar: string;
  monthlyIncome: string;
  loanAmountRequired: string;
  dob: string;
  gender: string;
  purpose: string;
  state: string;
  city: string;
  pincode: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  pan: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN card number")
    .required("PAN is required"),
  aadhaar: yup
    .string()
    .matches(/^\d{12}$/, "Invalid Aadhaar number")
    .required("Aadhaar is required"),
  monthlyIncome: yup
    .string()
    .min(0, "Monthly income cannot be negative")
    .required("Monthly income is required"),
  loanAmountRequired: yup
    .string()
    .min(0, "Loan amount cannot be negative")
    .required("Loan amount is required"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  purpose: yup.string().required("Purpose is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Invalid pincode")
    .required("Pincode is required"),
});

const FormStepTwo = ({
  setFormStep,
}: {
  setFormStep: Dispatch<SetStateAction<number>>;
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalDetailsFormType>({
    resolver: yupResolver(validationSchema),
  });
  const watchState = watch("state");
  const { formState, setFormState } = useFormContext();

  const continueHandler = (data: PersonalDetailsFormType) => {
    setFormState({
      ...formState,
      name: data.name,
      email: data.email,
      pan: data.pan,
      aadhaar: data.aadhaar,
      monthlyIncome: data.monthlyIncome,
      loanAmountRequired: data.loanAmountRequired,
      dob: data.dob,
      gender: data.gender,
      purpose: data.purpose,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
    });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormStep(2);
    }, 2000);
  };

  return (
    <div className="pt-12 lg:w-3/4 w-full h-full flex flex-col justify-between">
      <div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="name"
            control={control}
            defaultValue={formState.name}
            render={({ field: { onChange, value } }) => (
              <TextInputContainer
                label="Full Name"
                placeholder="Enter your name"
                type="text"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.name?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue={formState.email}
            render={({ field: { onChange, value } }) => (
              <TextInputContainer
                label="Email"
                placeholder="Enter your email"
                type="text"
                onChange={onChange}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.email?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="pan"
            control={control}
            defaultValue={formState.pan}
            render={({ field: { onChange, value } }) => (
              <TextInputContainer
                label="PAN Card Number"
                placeholder="Your PAN Number"
                type="text"
                onChange={onChange}
                maxLength={10}
                value={value}
                pan={true}
                errorMessage={errors.pan?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="aadhaar"
            control={control}
            defaultValue={formState.aadhaar}
            render={({ field: { onChange, value } }) => (
              <TextInputContainer
                label="Aadhar Card Number"
                placeholder="Your Aadhaar Card Number"
                type="text"
                onChange={(e)=> isNaN(Number(e))? null: onChange((''+e).trim())}
                maxLength={12}
                value={value}
                styles="md:mr-4"
                errorMessage={errors.aadhaar?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="monthlyIncome"
            control={control}
            defaultValue={formState.monthlyIncome}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Monthly Income"
                value={value}
                onChange={onChange}
                options={IncomeBrackets}
                styles="md:mr-4"
                errorMessage={errors.monthlyIncome?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="loanAmountRequired"
            control={control}
            defaultValue={formState.loanAmountRequired}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Loan Amount Required"
                value={value}
                onChange={onChange}
                options={LoanRequirementBrackets}
                errorMessage={errors.loanAmountRequired?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="dob"
            control={control}
            defaultValue={formState.dob}
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Date of Birth"
                placeholder="Enter Date"
                value={value}
                onChange={onChange}
                styles="md:mr-4"
                maxDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                errorMessage={errors.dob?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue={formState.gender}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Gender"
                value={value}
                onChange={onChange}
                options={[
                  {
                    key: "1",
                    value: "Male",
                    label: "Male",
                  },
                  {
                    key: "2",
                    value: "Female",
                    label: "Female",
                  },
                ]}
                styles="md:mr-4"
                errorMessage={errors.gender?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="purpose"
            control={control}
            defaultValue={formState.purpose}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="Purpose"
                value={value}
                onChange={onChange}
                options={LoanPurpose}
                errorMessage={errors.purpose?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
        <div className="md:flex flex-row justify-between">
          <Controller
            name="state"
            control={control}
            defaultValue={formState.state}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="State"
                value={value}
                onChange={onChange}
                options={BranchStates}
                styles="md:mr-4"
                errorMessage={errors.state?.message}
                disabled={!!loading}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            defaultValue={formState.city}
            render={({ field: { onChange, value } }) => (
              <SelectInput
                label="City"
                value={value}
                onChange={onChange}
                //@ts-ignore
                options={getCityByState(watchState)}
                styles="md:mr-4"
                errorMessage={errors.city?.message}
                disabled={!!loading || !watchState}
              />
            )}
          />

          <Controller
            name="pincode"
            control={control}
            defaultValue={formState.pincode}
            render={({ field: { onChange, value } }) => (
              <TextInputContainer
                label="Pincode"
                placeholder="Pincode"
                type="text"
                onChange={(e)=> isNaN(Number(e))? null: onChange((''+e).trim())}
                maxLength={6}
                value={value}
                errorMessage={errors.pincode?.message}
                disabled={!!loading}
              />
            )}
          />
        </div>
      </div>
      <div className="pb-8">
        <Divider />
        <div className="flex flex-row w-full items-center justify-between">
          <SecondaryCTA
            ctaText="Back"
            icon="back"
            onClick={() => setFormStep(0)}
          />
          <PrimaryCTA
            ctaText="Continue"
            icon="next"
            loading={loading}
            onClick={handleSubmit(continueHandler)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStepTwo;
