'use client';

import { Badge, Card } from '@tremor/react';
import Image from 'next/image';
import {
  aadhaarFormatter,
  enumCleaner,
  getCustomerInitials,
  selectPillColor,
} from '@/utils/utils';
import { TbCopy, TbEdit, TbUser } from 'react-icons/tb';
import { useState } from 'react';
import ModalContainer from '../modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputContainer from '../input-container';
import PrimaryCTA from '../primary-cta';
import { useFetchCustomerByLead } from '@/hooks/customer-api';
import { addDays, format, formatISO, parse, parseISO } from 'date-fns';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import ReloanForm from './reloan-lead-form';
import { useFetchLeadHistory } from '@/hooks/leads-api';
import DateInput from '../date-input';
import InputSelect from '../input-select';

type EditNameFormType = {
  name: string;
};

type EditEmailFormType = {
  email: string;
};

type EditPhoneFormType = {
  phone: string;
};

type EditGenderFormType = {
  gender: string;
};

type EditPanFormType = {
  pancard: string;
};

type EditAadhaarFormType = {
  aadhar_no: string;
};

type EditDOBFormType = {
  dob: string;
};

const nameFormValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

const emailValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const phoneValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number required'),
});

const genderFormValidationSchema = yup.object().shape({
  gender: yup.string().required('Gender is required'),
});

const panFormValidationSchema = yup.object().shape({
  pancard: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN card number')
    .required('PAN is required'),
});

const aadhaarFormValidationSchema = yup.object().shape({
  aadhar_no: yup
    .string()
    .matches(/^\d{12}$/, 'Invalid Aadhaar number')
    .required('Aadhaar is required'),
});

const dobFormValidationSchema = yup.object().shape({
  dob: yup.string().required('DOB is required'),
});

const CustomerCard = ({
  leadId,
  isEditable, // fromProfile,
}: {
  leadId: string;
  isEditable?: boolean;
  // fromProfile?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false);
  const [isEditGenderOpen, setIsEditGenderOpen] = useState(false);
  const [isEditPANOpen, setIsEditPANOpen] = useState(false);
  const [isEditAadhaarOpen, setIsEditAadhaarOpen] = useState(false);
  const [isEditDobOpen, setIsEditDobOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);

  const {
    control: nameFormControl,
    handleSubmit: nameFormHandleSubmit,
    reset: nameFormReset,
    formState: { errors: nameFormErrors },
  } = useForm<EditNameFormType>({
    resolver: yupResolver(nameFormValidationSchema),
  });

  const {
    control: emailFormControl,
    handleSubmit: emailFormHandleSubmit,
    reset: emailFormReset,
    formState: { errors: emailFormErrors },
  } = useForm<EditEmailFormType>({
    resolver: yupResolver(emailValidationSchema),
  });

  const {
    control: phoneFormControl,
    handleSubmit: phoneFormHandleSubmit,
    reset: phoneFormReset,
    formState: { errors: phoneFormErrors },
  } = useForm<EditPhoneFormType>({
    resolver: yupResolver(phoneValidationSchema),
  });

  const {
    control: genderFormControl,
    handleSubmit: genderFormHandleSubmit,
    reset: genderFormReset,
    formState: { errors: genderFormErrors },
  } = useForm<EditGenderFormType>({
    resolver: yupResolver(genderFormValidationSchema),
  });

  const {
    control: panFormControl,
    handleSubmit: panFormHandleSubmit,
    reset: panFormReset,
    formState: { errors: panFormErrors },
  } = useForm<EditPanFormType>({
    resolver: yupResolver(panFormValidationSchema),
  });

  const {
    control: dobFormControl,
    handleSubmit: dobFormSubmit,
    reset: dobFormReset,
    formState: { errors: dobFormErrors },
  } = useForm<EditDOBFormType>({
    resolver: yupResolver(dobFormValidationSchema),
  });

  const {
    control: aadhaarFormControl,
    handleSubmit: aadhaarFormHandleSubmit,
    reset: aadhaarFormReset,
    formState: { errors: aadhaarFormErrors },
  } = useForm<EditAadhaarFormType>({
    resolver: yupResolver(aadhaarFormValidationSchema),
  });

  const { customerData, isFetchingCustomerData, revalidateCustomerData } =
    useFetchCustomerByLead({
      leadId,
    });

  const { leadHistoryData, isFetchingLeadHistory } = useFetchLeadHistory({
    leadId,
  });

  // TODO: make these functions reusable

  const onNameFormSubmit = async (data: EditNameFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        ...data,
        mobile: customerData?.phoneNo,
      });
      toast.success('Name Updated!');
      nameFormReset({
        name: '',
      });
      revalidateCustomerData();
      setIsEditNameOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onEmailFormSubmit = async (data: EditEmailFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        ...data,
        mobile: customerData?.phoneNo,
      });
      toast.success('Email Updated!');
      emailFormReset({
        email: '',
      });
      revalidateCustomerData();
      setIsEditEmailOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onPhoneFormSubmit = async (data: EditPhoneFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update-phone', {
        customerId: customerData?.id,
        oldPhoneNo: customerData?.phoneNo,
        newPhoneNo: data.phone,
      });
      toast.success('Phone Number updated!');
      phoneFormReset({
        phone: '',
      });
      revalidateCustomerData();
      setIsEditPhoneOpen(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onGenderFormSubmit = async (data: EditGenderFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        ...data,
        mobile: customerData?.phoneNo,
      });
      toast.success('Gender Updated!');
      genderFormReset({
        gender: '',
      });
      revalidateCustomerData();
      setIsEditGenderOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onPANFormSubmit = async (data: EditPanFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        ...data,
        mobile: customerData?.phoneNo,
      });
      toast.success('PAN Updated!');
      panFormReset({
        pancard: '',
      });
      revalidateCustomerData();
      setIsEditPANOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onAadhaarFormSubmit = async (data: EditAadhaarFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        ...data,
        mobile: customerData?.phoneNo,
      });
      toast.success('Aadhaar Updated!');
      aadhaarFormReset({
        aadhar_no: '',
      });
      revalidateCustomerData();
      setIsEditAadhaarOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  const onDobFormSubmit = async (data: EditDOBFormType) => {
    try {
      setLoading(true);
      await axiosInstance.put('/customer/update', {
        dob: formatISO(parse(data.dob, 'yyyy-MM-dd', new Date())),
        mobile: customerData?.phoneNo,
      });
      toast.success('DOB Updated!');
      dobFormReset({
        dob: '',
      });
      revalidateCustomerData();
      setIsEditDobOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error('Something went wrong!');
    }
  };

  if (isFetchingCustomerData || isFetchingLeadHistory) {
    return (
      <Card className="flex flex-col justify-center max-h-max shadow-md">
        <div className="animate-pulse">
          <div className="flex flex-row w-full items-center">
            <div className="h-[60px] w-[60px] rounded-full b-2 border-black mr-4 bg-gray-400 flex items-center justify-center">
              <span className="text-2xl">
                <TbUser />
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
          </div>
          <div className="w-full pt-4">
            <div className="mb-8 mt-4">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-4/5 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
            <div className="my-8">
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col items-center max-h-max">
        <div className="flex flex-col flex-1 w-full items-start justify-start">
          <div className="flex flex-row items-center mb-4">
            <p className="text-sm">Copy Lead ID</p>
            <TbCopy
              className="text-primaryColor text-sm cursor-pointer ml-4"
              onClick={() => {
                navigator.clipboard.writeText(leadId);
                toast.success('Lead ID copied!');
              }}
            />
          </div>
          <div className="flex flex-row items-center mb-4">
            <p className="text-sm">Copy Customer ID</p>
            <TbCopy
              className="text-primaryColor text-sm cursor-pointer ml-4"
              onClick={() => {
                navigator.clipboard.writeText(customerData?.id || '');
                toast.success('Customer ID copied!');
              }}
            />
          </div>
          {customerData?.customerPicture ? (
            <div className="h-16 w-16 rounded-full mr-4 flex items-center justify-center">
              <Image
                src={customerData.customerPicture}
                alt=""
                height={0}
                width={0}
                sizes="100vw"
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full mr-4 bg-gray-400 flex items-center justify-center">
              <p className="text-white font-bold text-lg">
                {getCustomerInitials(customerData?.customerName || '')}
              </p>
            </div>
          )}
          <div className="flex flex-row items-center">
            <p className="font-medium text-base mt-2">
              {customerData?.customerName}
            </p>
            {isEditable && (
              <span
                className="ml-4 text-base cursor-pointer mt-2"
                onClick={() => setIsEditNameOpen(true)}>
                <TbEdit />
              </span>
            )}
          </div>
        </div>
        <div className="w-full grid lg:grid-cols-1 sm:grid-cols-3 grid-cols-1  lg:gap-0 gap-3 mt-2">
          <div className="my-4">
            <p className="text-xs font-medium text-gray-400 mb-2">Email</p>
            <div className="flex flex-row items-center mt-1">
              <p className="text-sm font-medium">{customerData?.email}</p>
              {isEditable && (
                <span
                  className="ml-3 text-base cursor-pointer"
                  onClick={() => setIsEditEmailOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">Phone No.</p>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium mt-1">
                {customerData?.phoneNo}
              </p>
              {isEditable && (
                <span
                  className="ml-3 mt-1 text-sm cursor-pointer"
                  onClick={() => setIsEditPhoneOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">Gender</p>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium mt-1">{customerData?.gender}</p>
              {isEditable && (
                <span
                  className="ml-3 mt-1 text-sm cursor-pointer"
                  onClick={() => setIsEditGenderOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">PAN</p>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium mt-1">{customerData?.pan}</p>
              {isEditable && (
                <span
                  className="ml-3 mt-1  text-sm cursor-pointer"
                  onClick={() => setIsEditPANOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">Aadhaar</p>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium mt-1">
                {aadhaarFormatter(customerData?.aadhar || '')}
              </p>
              {isEditable && (
                <span
                  className="ml-3 mt-1  text-sm cursor-pointer"
                  onClick={() => setIsEditAadhaarOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">
              Date of Birth
            </p>
            <div className="flex flex-row items-center">
              <p className="text-sm font-medium">
                {format(
                  addDays(parseISO(customerData?.dob || ''), 1),
                  'dd-MM-yyyy',
                )}
              </p>
              {isEditable && (
                <span
                  className="ml-3 mt-1 text-sm cursor-pointer"
                  onClick={() => setIsEditDobOpen(true)}>
                  <TbEdit />
                </span>
              )}
            </div>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">City</p>
            <p className="text-sm font-medium">{customerData?.city}</p>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">Status</p>
            <span className="">
              <Badge
                color={selectPillColor(
                  enumCleaner(customerData?.status || ''),
                )}>
                {enumCleaner(customerData?.status || '')}
              </Badge>
            </span>
          </div>
          <div className="my-2">
            <p className="text-xs font-medium text-gray-400 mb-2">Created At</p>
            <p className="text-sm font-medium mt-1">
              {format(
                parseISO(customerData?.createdAt || ''),
                'dd-MM-yy hh:mm:ss',
              )}
            </p>
          </div>
          <div>
            <PrimaryCTA
              ctaText="Reloan"
              onClick={() => setIsCreateLeadOpen(true)}
              disabled={
                (customerData?.status !== 'Closed' &&
                  customerData?.status !== 'Rejected' &&
                  customerData?.status !== 'No_Answer' &&
                  customerData?.status !== 'Duplicate') ||
                (leadHistoryData &&
                  leadHistoryData.at(0)?.status !== 'Closed' &&
                  leadHistoryData.at(0)?.status !== 'Rejected' &&
                  leadHistoryData.at(0)?.status !== 'Not_Eligible' &&
                  leadHistoryData.at(0)?.status !== 'Duplicate' &&
                  leadHistoryData.at(0)?.status !== 'No_Answer')
              }
            />
          </div>
        </div>
      </Card>
      <ModalContainer
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="name"
          control={nameFormControl}
          defaultValue={customerData?.customerName}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Name"
              placeholder="Enter Name"
              type="text"
              onChange={onChange}
              value={value}
              errorMessage={nameFormErrors.name?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={nameFormHandleSubmit(onNameFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditEmailOpen}
        onClose={() => setIsEditEmailOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="email"
          control={emailFormControl}
          defaultValue={customerData?.email}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Email"
              placeholder="Enter email"
              type="email"
              onChange={onChange}
              value={value}
              errorMessage={emailFormErrors.email?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={emailFormHandleSubmit(onEmailFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditPhoneOpen}
        onClose={() => setIsEditPhoneOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="phone"
          control={phoneFormControl}
          defaultValue={customerData?.phoneNo}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Phone No."
              placeholder="Enter Phone No."
              type="text"
              maxLength={10}
              onChange={onChange}
              value={value}
              errorMessage={phoneFormErrors.phone?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={phoneFormHandleSubmit(onPhoneFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditGenderOpen}
        onClose={() => setIsEditGenderOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="gender"
          control={genderFormControl}
          defaultValue={customerData?.gender}
          render={({ field: { onChange, value } }) => (
            <InputSelect
              label="Gender"
              value={value}
              onChange={onChange}
              options={[
                {
                  key: '1',
                  value: 'Male',
                  label: 'Male',
                },
                {
                  key: '2',
                  value: 'Female',
                  label: 'Female',
                },
              ]}
              styles="md:mr-4"
              errorMessage={genderFormErrors.gender?.message}
              disabled={!!loading}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={genderFormHandleSubmit(onGenderFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditPANOpen}
        onClose={() => setIsEditPANOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="pancard"
          control={panFormControl}
          defaultValue={customerData?.pan}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="PAN"
              placeholder="Enter PAN"
              type="text"
              onChange={onChange}
              maxLength={10}
              value={value}
              errorMessage={panFormErrors.pancard?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={panFormHandleSubmit(onPANFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditAadhaarOpen}
        onClose={() => setIsEditAadhaarOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="aadhar_no"
          control={aadhaarFormControl}
          defaultValue={customerData?.aadhar}
          render={({ field: { onChange, value } }) => (
            <InputContainer
              label="Aadhaar"
              placeholder="Enter Aadhaar"
              type="text"
              onChange={onChange}
              maxLength={12}
              value={value}
              errorMessage={aadhaarFormErrors.aadhar_no?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={aadhaarFormHandleSubmit(onAadhaarFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isEditDobOpen}
        onClose={() => setIsEditDobOpen(false)}
        styles="bg-white w-[90%] md:w-[30%]">
        <Controller
          name="dob"
          control={dobFormControl}
          render={({ field: { onChange, value } }) => (
            <DateInput
              label="Date of Birth"
              placeholder="Select Date"
              value={value}
              onChange={onChange}
              errorMessage={dobFormErrors.dob?.message}
            />
          )}
        />
        <div className="flex flex-row justify-end">
          <PrimaryCTA
            ctaText="Confirm Edit"
            onClick={dobFormSubmit(onDobFormSubmit)}
            icon="edit"
            disabled={!!loading}
            loading={!!loading}
          />
        </div>
      </ModalContainer>

      <ModalContainer
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
        styles="bg-white w-[75%]">
        <ReloanForm phoneNo={customerData?.phoneNo || ''} />
      </ModalContainer>
    </>
  );
};

export default CustomerCard;
