export type ObjectType = {
  key: number;
  value: string;
};

export enum LeadStatusEnum {
  Fresh_Lead,
  Callback,
  Interested,
  Not_Interested,
  Wrong_Number,
  Documents_Received,
  Approved,
  Bank_Update,
  Disbursed,
  Closed,
  Part_Payment,
  Settlement,
  Incomplete_Documents,
  DNC,
  Rejected,
  Not_Eligible,
  Duplicate,
  Other,
  No_Answer,
  EMI_Paid,
  Less_Salary,
  Out_of_Range,
  EMI_PRECLOSE,
}

export enum VerificationStatusEnum {
  Verified,
  Not_Verified,
  Rejected,
  Pending,
}

export type DateRangeFormType = {
  dateRange: {
    from: Date;
    to: Date;
  };
};

export type DownloadLeadsDataType = {
  ['Lead Assignee']: string;
  ['Customer Name']: string;
  ['Customer Id']: string;
  ['Email']: string;
  ['Phone No']: string;
  ['Loan Required']: string;
  ['Purpose']: string;
  ['Tenure']: string;
  ['Monthly Income']: string;
  ['Salary Mode']: string;
  ['City']: string;
  ['State']: string;
  ['Pincode']: string;
  ['utmSource']: string;
  ['Domain']: string;
  ['Status']: string;
  ip: string;
  ['Created At']: string;
  ['Updated At']: string;
  ['Loan Count']: string;
};
