import PrimaryCTA from "@/components/primary-cta";
import SelectInput from "@/components/select-input";
import TextInputContainer from "@/components/text-input";
import { BranchStates } from "@/constants/states";
import { getCityByState } from "@/utils/util-functions";
import { yupResolver } from "@hookform/resolvers/yup";
import { Divider, Metric, Subtitle } from "@tremor/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { LoanPurpose } from "@/constants/loan-purpose";
import { useFetchReapplyData } from "@/hooks/customer-api";
import { axiosInstance } from "@/network/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContextProvider";
import { useRouter } from "next/navigation";
import { IncomeBrackets } from "@/constants/income-bracket";
import { LoanRequirementBrackets } from "@/constants/loan-requirement-brackets";
import * as Sentry from "@sentry/nextjs";

type ReapplyLoanFormType = {
  monthlyIncome: string;
  loanAmountRequired: string;
  purpose: string;
  state: string;
  city: string;
  pincode: string;
};

const validationSchema = yup.object().shape({
  monthlyIncome: yup.string().required("Monthly income is required"),
  loanAmountRequired: yup.string().required("Loan amount is required"),
  purpose: yup.string().required("Purpose is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  pincode: yup
    .string()
    .matches(/^\d{6}$/, "Invalid pincode")
    .required("Pincode is required"),
});

const StepOne = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReapplyLoanFormType>({
    resolver: yupResolver(validationSchema),
  });
  const watchState = watch("state");
  const { reapplyData, isFetchingReapplyData } = useFetchReapplyData();

  const continueHandler = async (data: ReapplyLoanFormType) => {
    try {
      setLoading(true);
      await axiosInstance.post("/customer/reapply", {
        ...data,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      });
      toast.success("Loan reapplication successful!");
      router.push(`/customer_profile/${user?.id}`);
    } catch (error) {
      toast.error("Something went wrong!");
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("state", reapplyData?.state || "");
  }, [isFetchingReapplyData, reapplyData?.state, setValue]);

  if (isFetchingReapplyData) {
    return (
      <div className="pt-12 lg:w-3/4 w-full h-full flex flex-col justify-between">
        <div>
          <div className="md:flex flex-row justify-between mb-8 mt-4">
            <div className="h-8 bg-gray-200 rounded-full w-full md:mr-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-full md:mr-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-full"></div>
          </div>
          <div className="md:flex flex-row justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded-full w-full"></div>
          </div>
          <div className="md:flex flex-row justify-between">
            <div className="h-8 bg-gray-200 rounded-full w-full md:mr-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-full md:mr-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 lg:w-3/4 w-full h-full flex flex-col justify-between">
      <div>
        {reapplyData?.latestLeadStatus === "Open" ? (
          <div className="flex flex-col justify-center items-center">
            <Metric className="text-gray-600">Loan already applied.</Metric>
            <Subtitle>You cannot apply again until the case is closed</Subtitle>
          </div>
        ) : (
          <>
            <div className="md:flex flex-row justify-between">
              <Controller
                name="monthlyIncome"
                control={control}
                defaultValue={reapplyData?.monthlyIncome || ""}
                render={({ field: { onChange, value } }) => (
                  <SelectInput
                    label="Monthly Income"
                    value={value}
                    onChange={onChange}
                    styles="md:mr-4"
                    options={IncomeBrackets}
                    errorMessage={errors.monthlyIncome?.message}
                    disabled={!!loading}
                  />
                )}
              />
              <Controller
                name="loanAmountRequired"
                control={control}
                defaultValue={reapplyData?.loanAmountRequired || ""}
                render={({ field: { onChange, value } }) => (
                  <SelectInput
                    label="Loan Amount Required"
                    value={value}
                    onChange={onChange}
                    styles="md:mr-4"
                    options={LoanRequirementBrackets}
                    errorMessage={errors.loanAmountRequired?.message}
                    disabled={!!loading}
                  />
                )}
              />
              <Controller
                name="purpose"
                control={control}
                defaultValue={reapplyData?.purpose || ""}
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
                defaultValue={reapplyData?.state || ""}
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
                defaultValue={reapplyData?.city || ""}
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
                defaultValue={reapplyData?.pincode || ""}
                render={({ field: { onChange, value } }) => (
                  <TextInputContainer
                    label="Pincode"
                    placeholder="Pincode"
                    type="text"
                    onChange={onChange}
                    maxLength={6}
                    value={value}
                    errorMessage={errors.pincode?.message}
                    disabled={!!loading}
                  />
                )}
              />
            </div>
            <div className="pb-8">
              <Divider />
              <div className="flex flex-row w-full items-center justify-between">
                <PrimaryCTA
                  ctaText="Reapply"
                  loading={loading}
                  onClick={handleSubmit(continueHandler)}
                  disabled={!!loading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepOne;
