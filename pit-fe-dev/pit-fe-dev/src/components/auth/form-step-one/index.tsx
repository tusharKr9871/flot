import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Bold, Divider, Text } from "@tremor/react";
import NumberInputContainer from "@/components/number-input";
import PrimaryCTA from "@/components/primary-cta";
import OtpInput from "react-otp-input";
import { axiosInstance } from "@/network/axiosInstance";
import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContextProvider";
// import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/FormContextProvider";
import * as Sentry from "@sentry/nextjs";

// type CustomerType = {
//   id: string;
//   name: string;
//   token: string;
// };

const validationSchema = yup.object().shape({
  mobile: yup
    .number()
    .min(1000000000, "Mobile number can only be 10 digits")
    .max(9999999999, "Mobile number can only be 10 digits")
    .typeError("Phone number can only be a number")
    .required("Mobile number is required"),
});

const FormStepOne = ({
  setFormStep,
}: {
  setFormStep: Dispatch<SetStateAction<number>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [num, setNum] = useState(30);
  // const { setUser } = useAuth();
  // const router = useRouter();
  const { formState, setFormState } = useFormContext();

  const decreaseNum = () => setNum((prev) => prev - 1);
  useEffect(() => {
    if (num <= 0) {
      clearInterval(intervalRef.current);
    }
  }, [num]);

  const intervalRef = useRef();

  const [otp, setOtp] = useState("");
  const [requestId, setRequestId] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ mobile: number }>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const sendOTP = async (data: { mobile: number }) => {
    try {
      setLoading(true);
      // await new Promise((resolve)=> setTimeout(() => { resolve("akjdnakdjab")}, 5000))
      const params = new URLSearchParams();
      params.append("phone_number", data.mobile.toString());
      // params.append("clientId", process.env.NEXT_PUBLIC_CLIENT_ID);

      const response = await axiosInstance.post(`sendOtp.php`, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.request_id) {
        setRequestId(response.data.request_id);
      }
      setLoading(false);
      setStep(1);
      //@ts-ignore
      intervalRef.current = setInterval(decreaseNum, 1000);
      toast.success("OTP sent successfully");
    } catch (error) {
      Sentry.captureException(error);
      setLoading(false);
      toast.error("please try after sometime!");
    }
  };

  const verifyOTP = async (data: { mobile: number }) => {
    try {
      setLoading(true);
      setFormState({
        ...formState,
        phoneNo: data.mobile.toString(),

      });
      const params = new URLSearchParams();
      params.append("phone_number", data.mobile.toString());
      params.append("otp", otp);
      // params.append("clientId", process.env.NEXT_PUBLIC_CLIENT_ID);
      params.append("request_id", requestId);
      await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_PHP_BASE_URL}verifyOtp.php`, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("OTP verified successfully");

      // setUser({
      //   id: response.data.customer.id,
      //   name: response.data.customer.name,
      //   token: response.data.customer.token,
      // });

      // if (!response.data.customerExists) {
        setLoading(false);
        setFormStep(1);
      // } else {
      //   localStorage.setItem("token", response.data.customer.token);
        // router.replace(`/customer_profile/1`);
      // }
    } catch (error) {
      Sentry.captureException(error);
      setLoading(false);
      toast.error("Invalid Otp!");
    }
  };

  return (
    <div className="pt-12 md:w-1/2 xs:w-3/4 w-full h-full flex flex-col justify-between">
      <div>
        {step === 0 ? (
          <Controller
            name="mobile"
            control={control}
            render={({ field: { onChange, value } }) => (
              <NumberInputContainer
                label="Phone Number"
                placeholder="Enter your phone number"
                onChange={(e) => Number(e) > 9999999999 ? null : onChange(e)}
                inputMode="tel"
                value={value}
                max={9999999999}
                styles="md:mr-4"
                errorMessage={errors.mobile?.message}
                disabled={!!loading}
                autoFocus={true}
              />
            )}
          />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="w-full pb-4">
              <Text>
                OTP sent to <Bold>{getValues("mobile")}</Bold>
              </Text>
              <Text className="text-xs mt-4">
                Did not recieve the OTP?{" "}
                {num <= 0 ? (
                  <span
                    className="underline cursor-pointer font-semibold"
                    onClick={handleSubmit(sendOTP)}
                  >
                    Retry
                  </span>
                ) : (
                  <span>
                    Retry after <span className="font-semibold">{num}</span>{" "}
                    seconds
                  </span>
                )}
              </Text>
            </div>
            <div className="flex w-4/5 justify-center items-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                inputType="tel"
                inputStyle={{
                  width: "50%",
                }}
                renderInput={(props) => (
                  <input
                    {...props}
                    type="tel"
                    className="text-2xl h-12 font-normal mx-1 border border-gray-300 rounded text-center focus:border-gray-400 focus:outline-none"
                  />
                )}
                shouldAutoFocus={step === 1}
              />
            </div>
          </div>
        )}
      </div>
      <div className="pb-8">
        <Divider />
        <div className="flex flex-row w-full items-center justify-end">
          {step === 0 ? (
            <PrimaryCTA
              ctaText="Send OTP"
              loading={loading}
              onClick={handleSubmit(sendOTP)}
            />
          ) : (
            <PrimaryCTA
              ctaText="Verify"
              loading={loading}
              onClick={handleSubmit(verifyOTP)}
              disabled={otp.length !== 4}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStepOne;
