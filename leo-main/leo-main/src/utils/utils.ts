import { BranchCities } from '@/constants/branch';
import { axiosInstance } from '@/network/axiosInstance';
import { format, parse } from 'date-fns';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export const truncateText = (text: string, length: number) => {
  const truncatedText =
    text.length > length ? text.substring(0, length) + '...' : text;
  return truncatedText;
};

export const enumCleaner = (text: string) => {
  const cleanedText = text.replace(/_/g, ' ');
  return cleanedText;
};

export const selectPillColor = (status: string) => {
  switch (status) {
    case 'Fresh Lead':
      return 'sky';
    case 'Callback':
      return 'yellow';
    case 'Interested':
      return 'teal';
    case 'Not Interested':
      return 'amber';
    case 'Wrong Number':
      return 'red';
    case 'Documents Received':
      return 'green';
    case 'Approved':
      return 'emerald';
    case 'Bank Update':
      return 'yellow';
    case 'Disbursed':
      return 'lime';
    case 'Closed':
      return 'emerald';
    case 'Part Payment':
      return 'orange';
    case 'Settlement':
      return 'red';
    case 'Incomplete Documents':
      return 'gray';
    case 'DNC':
      return 'red';
    case 'Rejected':
      return 'red';
    case 'Not Eligible':
      return 'red';
    case 'Duplicate':
      return 'stone';
    case 'Other':
      return 'gray';
    case 'No Answer':
      return 'violet';
    case 'EMI Paid':
      return 'green';
    case 'Less Salary':
      return 'orange';
    case 'Out of Range':
      return 'red';
    case 'EMI_PRECLOSE':
      return 'yellow';
  }
};

export const selectLoanPillColor = (status: string) => {
  switch (status) {
    case 'Overdue':
      return 'red';
    case 'Due':
      return 'orange';
    case 'Closed':
      return 'emerald';
    case 'Part Payment':
      return 'orange';
    case 'Settlement':
      return 'red';
  }
};

export const getCustomerInitials = (name: string) => {
  const initials = name.slice(0, 2);
  return initials;
};

export const getVerificationPillColor = (status: string) => {
  switch (status) {
    case 'Verified':
      return 'green';
    case 'Not_Verified':
      return 'yellow';
    case 'Rejected':
      return 'red';
  }
};

export const aadhaarFormatter = (aadhaar: string) => {
  const formattedAadhaar = aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  return formattedAadhaar;
};

export const updateToCDNUrl = (originalUrl: string) => {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
  const cdnEndpoint = process.env.NEXT_PUBLIC_CDN_ENDPOINT;
  if (!endpoint || !cdnEndpoint) {
    throw new Error('Endpoint or CDN endpoint is not defined');
  }
  const updatedUrl = originalUrl.replace(endpoint, cdnEndpoint);

  return updatedUrl;
};

export const getUrlExtension = (url: string | undefined) => {
  if (!url) {
    return '';
  }
  const splitUrl = url.split(/[#?]/)[0].split('.');
  if (splitUrl.length === 1) {
    return '';
  }
  return splitUrl.pop()!.trim();
};

export const formatIndianNumber = (number: number) => {
  // round off the number to two decimal places
  number = Math.round((number + Number.EPSILON) * 100) / 100;
  // Convert the number to a string for easier manipulation
  const numStr = number.toString();

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.');

  // Regular expression for Indian numbering format
  const regex = /\B(?=(\d{2})+(?!\d))/g;

  // Format the first three digits separately
  const firstThree =
    integerPart.length > 3
      ? integerPart.substring(0, integerPart.length - 3).replace(regex, ',')
      : '';

  // Get the rest of the number
  const rest =
    integerPart.length > 3
      ? ',' + integerPart.substring(integerPart.length - 3)
      : integerPart;

  // Combine the parts
  const formattedInteger = firstThree + rest;

  // Combine the formatted integer and decimal parts
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return '₹' + formattedNumber;
};

export const generateYears = () => {
  const currentYear = new Date(2023, 1, 1).getFullYear();
  const years = [];

  for (let i = 0; i < 10; i++) {
    years.push({
      key: i.toString(),
      value: (currentYear + i).toString(),
      label: (currentYear + i).toString(),
    });
  }

  return years;
};

export const getMonthName = (month: number) => {
  const date = new Date(2000, month - 1, 1); // Adjust year as needed
  return format(date, 'MMMM');
};

export const getMonthNumber = (monthName: string) => {
  if (!monthName) {
    return -1;
  }
  const parsedDate = parse(monthName, 'MMMM', new Date());
  return parseInt(format(parsedDate, 'M'), 10);
};

export const validateIFSC = (ifscCode: string) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
};
export const setProgressFunction = ({
  totalTimeInSeconds,
  setProgress,
}: {
  totalTimeInSeconds: number;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const startTime = new Date().getTime();
  const interval = 100; // Update every second

  const updateProgress = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const percentCompleted = Math.min(
      (elapsedTime / (totalTimeInSeconds * 1000)) * 100,
      100,
    );

    setProgress(percentCompleted);

    if (percentCompleted < 95) {
      setTimeout(updateProgress, interval);
    }
  };

  updateProgress();
};
export const fetchLeadsDataForDownload = async ({
  startDate,
  endDate,
  searchTerm,
  leadType = 'Fresh_Lead',
  assigneeId,
  setLoading,
  setIsOpen,
  setProgress,
}: {
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  leadType?: string;
  assigneeId?: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  try {
    setLoading(true);
    setIsOpen(true);
    toast.success('Download started');
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/leads/download-leads-by-filter`,
    );

    if (startDate && endDate) {
      url.searchParams.append('startDate', format(startDate, 'dd-MM-yyyy'));
      url.searchParams.append('endDate', format(endDate, 'dd-MM-yyyy'));
    }

    if (leadType && leadType !== 'all') {
      url.searchParams.append('leads', leadType);
    }

    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }

    if (assigneeId) {
      url.searchParams.append('assigneeId', assigneeId);
    }

    const response = await axiosInstance.get(url as unknown as string);
    handleDownload(response.data, leadType);
    setProgress(100);
    setIsOpen(false);
    setProgress(0);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Download failed');
    setLoading(false);
    setIsOpen(false);
    return null;
  }
};

export const handleDownload = <T extends Record<string, string>>(
  data: T[],
  fileName: string,
) => {
  const ws = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0]),
  });

  const maxWidthOfColumns = Object.keys(data[0]).map(col => {
    return {
      wch: maxWidthOfColumn(data, col),
    };
  });

  ws['!cols'] = maxWidthOfColumns;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
  XLSX.writeFile(wb, `${fileName}.xlsx`, { compression: true });
};

export const maxWidthOfColumn = <T extends Record<string, string>>(
  data: T[],
  columnName: string,
) => {
  const max_width = data.reduce((max, obj) => {
    //@ts-ignore
    const objLength = obj[columnName].length;
    return objLength > max ? objLength : max;
  }, 10);

  return max_width;
};

export const getBadgeColor = (value1: number, value2: number) => {
  const valPercent = (value1 / value2) * 100;
  if (valPercent < 25) {
    return 'red';
  } else if (valPercent < 50) {
    return 'orange';
  } else {
    return 'green';
  }
};

export const getAchievementPercent = (amount: number, target: number) => {
  let achievementPercent = 0;
  achievementPercent = (amount / target) * 100;

  if (isNaN(achievementPercent) || !isFinite(achievementPercent)) {
    return 0;
  }
  return achievementPercent.toFixed(2);
};

export const getDeficit = (amount: number, target: number) => {
  let deficit = 0;
  deficit = target - amount;

  return deficit;
};

export const getCityByState = (state: string) => {
  const stateWiseCities = BranchCities.map(city => {
    if (city.state === state) {
      return {
        key: city.key,
        label: city.label,
        value: city.value,
      };
    }
  }).filter(city => city !== undefined);

  return stateWiseCities;
};

export const paymentStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'green';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    case 'MANUALLY_REJECTED':
      return 'red';
  }
};

export const selectEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'Download':
      return 'teal';
    case 'Upload':
      return 'yellow';
    case 'Add':
      return 'blue';
    case 'Update':
      return 'orange';
    case 'Delete':
      return 'red';
    case 'Login':
      return 'green';
    case 'Verify':
      return 'purple';
    case 'Audit_Access':
      return 'pink';
  }
};

export const getGreetingForTheDay = () => {
  const time = new Date().getHours();

  if (time < 12) {
    return 'Good Morning';
  } else if (time < 16) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const ticketStatus = (status: string) => {
  switch (status) {
    case 'Open':
      return 'red';
    case 'In_Progress':
      return 'yellow';
    case 'Closed':
      return 'teal';
    case 'Resolved':
      return 'green';
  }
};
