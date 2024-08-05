'use client';

import Image from 'next/image';
import InputContainer from '@/components/input-container';
import PrimaryCTA from '@/components/primary-cta';
import { Bold, Text, Title } from '@tremor/react';
import { TbChevronLeft } from 'react-icons/tb';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContextProvider';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import Loader from '@/components/loader';
import { getGreetingForTheDay } from '@/utils/utils';
import Tooltip from '@/components/tooltip';

const Login = () => {
  const { getOTP, validateOTP, formStep, setFormStep, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [num, setNum] = useState(30);

  const decreaseNum = () => setNum(prev => prev - 1);
  useEffect(() => {
    if (num <= 0) {
      clearInterval(intervalRef.current);
    }
  }, [num]);

  const intervalRef = useRef();

  const [otp, setOtp] = useState('');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      setEmailError('Invalid email!');
    } else {
      setEmailError(''); // Clear the error if the email is valid
    }

    return isValid;
  };

  // const onSubmit = async () => {
  //   if (formStep === 1) {
  //     if (validateEmail()) {
  //       await getOTP({ email });
  //       //@ts-ignore
  //       intervalRef.current = setInterval(decreaseNum, 1000);
  //     }
  //   } else {
  //     await validateOTP({ email, otp });
  //   }
  // };

  // const resendOTP = () => {
  //   setNum(30);
  //   //@ts-ignore
  //   intervalRef.current = setInterval(decreaseNum, 1000);
  //   toast.success('OTP sent successfully');
  //   getOTP({ email });
  // };

  return (
    <div
      className="min-h-screen flex relative overflow-y-hidden bg-cover"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_LOGIN_BG})` }}>
      <div className="w-full flex items-center justify-center">
        <div className="bg-white relative shadow-lg rounded-xl lg:w-[30%] md:w-[40%] sm:w-[50%] w-[60%] px-12 py-8 flex-items-center justify-center flex-col">
          {formStep === 2 && (
            <>
              <div className="absolute top-8 left-6 cursor-pointer">
                <span className="text-2xl" onClick={() => setFormStep(1)}>
                  <TbChevronLeft />
                </span>
              </div>
              <div className="absolute top-8 right-6 cursor-pointer">
                <Tooltip
                  content={`Not Getting OTP on email? \n Contact an Admin for the OTP.`}>
                  <button
                    type="button"
                    className="text-white h-6 w-6 flex items-center justify-center hover:bg-gray-400 bg-gray-800 font-medium rounded-full text-base p-3 text-center">
                    ?
                  </button>
                </Tooltip>
              </div>
            </>
          )}
          <div className="py-6">
            <div className="flex w-full justify-center items-center">
              <div className="w-32 h-32 items-center justify-center flex">
                <Image
                  alt="Logo"
                  src={`${process.env.NEXT_PUBLIC_LOGIN_LOGO}`}
                  height={0}
                  width={0}
                  sizes="100vw"
                  style={{
                    height: 'auto',
                    width: 'auto',
                  }}
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <Title className="pt-4">{getGreetingForTheDay()}!</Title>
            </div>
          </div>
          {formStep === 1 ? (
            <>
              <InputContainer
                label="Work Email"
                placeholder="Enter work email"
                type="email"
                onChange={setEmail}
                value={email}
                styles="w-full"
                errorMessage={emailError}
                autoFocus={true}
              />
              <div className="w-full flex items-end justify-end">
                {/* <PrimaryCTA
                  ctaText="Submit"
                  onClick={onSubmit}
                  viewStyle="py-2 mt-4"
                  loading={loading}
                  disabled={email === '' || !!loading}
                /> */}
              </div>
            </>
          ) : formStep === 2 ? (
            <>
              <div className="flex flex-col justify-center items-center">
                <div className="w-full pb-4">
                  <Text>
                    OTP sent to <Bold>{email}</Bold>
                  </Text>
                  {/* <Text className="text-xs mt-4">
                    Did not recieve the OTP?{' '}
                    {num <= 0 ? (
                      <span
                        className="underline cursor-pointer font-semibold"
                        onClick={() => resendOTP()}>
                        Retry
                      </span>
                    ) : (
                      <span>
                        Retry after <span className="font-semibold">{num}</span>{' '}
                        seconds
                      </span>
                    )}
                  </Text> */}
                </div>
                <div className="flex w-4/5 justify-center items-center">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    inputType="tel"
                    inputStyle={{
                      width: '50%',
                    }}
                    renderInput={props => (
                      <input
                        {...props}
                        type="tel"
                        className="text-2xl h-12 font-normal mx-1 border border-gray-300 rounded text-center focus:border-gray-400 focus:outline-none"
                      />
                    )}
                  />
                </div>
              </div>
              {/* <div className="w-full flex items-end justify-end">
                <PrimaryCTA
                  ctaText="Login"
                  onClick={onSubmit}
                  viewStyle="py-2 mt-4"
                  loading={loading}
                  disabled={otp.length !== 4 || !!loading}
                />
              </div> */}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
