import { BranchCities } from "@/constants/states";

export const getCityByState = (state: string) => {
  const stateWiseCities = BranchCities.map((city) => {
    if (city.state === state) {
      return {
        key: city.key,
        label: city.label,
        value: city.value,
      };
    }
  }).filter((city) => city !== undefined);

  return stateWiseCities;
};

export const formatIndianNumber = (number: number) => {
  // Convert the number to a string for easier manipulation
  const numStr = number.toString();

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Combine the formatted integer and decimal parts
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return "₹" + formattedNumber;
};

export const getCustomerInitials = (name: string) => {
  const initials = name.slice(0, 2);
  return initials;
};

export const aadhaarFormatter = (aadhaar: string) => {
  const formattedAadhaar = aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
  return formattedAadhaar;
};

export const getVerificationPillColor = (status: string) => {
  switch (status) {
    case "Verified":
      return "green";
    case "Not_Verified":
      return "yellow";
    case "Rejected":
      return "red";
  }
};

export const enumCleaner = (text: string) => {
  const cleanedText = text.replace(/_/g, " ");
  return cleanedText;
};
