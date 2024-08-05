"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type FormStateType = {
  phoneNo: string;
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

type FormContextType = {
  formState: FormStateType;
  setFormState: Dispatch<SetStateAction<FormStateType>>;
};

//@ts-ignore
const FormContext = createContext<FormContextType>();

export const useFormContext = () => {
  return useContext(FormContext);
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState({
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

  return (
    <FormContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormContext.Provider>
  );
};
