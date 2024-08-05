'use client';

import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { Badge, Card, Metric, Title } from '@tremor/react';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { TbUser } from 'react-icons/tb';
import { useFetchLead } from '@/hooks/leads-api';
import { useCollectionTimeline } from '@/hooks/collection-api';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import InputSelect from '@/components/input-select';
import { useAuth } from '@/context/AuthContextProvider';
import NumberInputContainer from '@/components/input-number';
import { CallResponseCodes } from '@/constants/call-response-codes';
import { WaiverRequestType } from '@/constants/waiver-request-types';

type CollectionTimelineFormType = {
  relatedTo: string;
  customerResponse: string;
};

type WaiverRequestFormType = {
  waiverAmountType: string;
  waiverAmount: number;
};

const validationSchema = yup.object({
  relatedTo: yup.string().required('Related To required'),
  customerResponse: yup.string().required('Customer response Required'),
});

const waiverRequestValidationSchema = yup.object({
  waiverAmountType: yup.string().required('Waiver Amount Type is required'),
  waiverAmount: yup.number().required('Waiver Amount required'),
});

const CollectionTimeline = ({ leadId }: { leadId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWaiverModalOpen, setIsWaiverModalOpen] = useState(false);
  const {
    collectionTimelineData,
    isFetchingCollectionTimelineData,
    revalidateCollectionTimelineData,
  } = useCollectionTimeline({
    leadId,
  });
  const { leadData, revalidateLead } = useFetchLead({ leadId });
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionTimelineFormType>({
    resolver: yupResolver(validationSchema),
  });
  const {
    control: waiverRequestControl,
    handleSubmit: waiverRequestHandleSubmit,
    reset: waiverRequestReset,
    formState: { errors: waiverRequestErrors },
  } = useForm<WaiverRequestFormType>({
    resolver: yupResolver(waiverRequestValidationSchema),
  });

  const onSubmit = async (data: CollectionTimelineFormType) => {
    try {
      setLoading(true);
      const collectionTimelinedata = {
        ...data,
      };
      await axiosInstance.post(
        `/collection-timeline/create/${leadId}`,
        collectionTimelinedata,
      );
      toast.success('Collection timeline added successfully!');
      reset({
        relatedTo: '',
        customerResponse: '',
      });
      revalidateCollectionTimelineData();
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot add, something went wrong!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  const requestWaiver = async (data: WaiverRequestFormType) => {
    try {
      console.log(data);
      setLoading(true);
      await axiosInstance.post(
        `/collection-timeline/raise-waiver-request/${leadId}`,
        {
          waiverRequest: 'Requested',
          waiverRequestType: data.waiverAmountType,
          waiverAmount: data.waiverAmount,
        },
      );
      toast.success('Waiver request raised successfully!');
      revalidateLead();
      waiverRequestReset({
        waiverAmount: 0,
      });
      setIsWaiverModalOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error('Cannot add, something went wrong!');
      Sentry.captureException(error);
      setLoading(false);
    }
  };

  if (isFetchingCollectionTimelineData) {
    return (
      <div className="flex flex-col">
        <ol className="relative border-l border-gray-200">
          <li className="mb-10 ml-6 animate-pulse w-[90%]">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
              <TbUser className="rounded-full shadow-lg" />
            </span>
            <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
              <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                <div className="h-2.5 bg-gray-200 rounded-full w-8 mb-4"></div>
              </time>
              <div className="text-sm font-normal text-gray-500 flex flex-1 flex-col">
                <div className="text-tremor-default font-semibold text-gray-900 mb-2">
                  <div className="h-2.5 bg-gray-200 rounded-full w-[90%] mb-4"></div>
                </div>
                <div className="flex flex-row items-center">
                  <span className="font-semibold text-gray-900 mr-1">
                    <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
                  </span>
                </div>
                <div className="p-3 mt-4 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 w-4/5">
                  <div className="h-2.5 bg-gray-200 rounded-full mb-4"></div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex flex-row mb-4">
          <div className="flex flex-row flex-1 items-center justify-between">
            <p className="text-tremor-title font-semibold">
              Collection Timeline
            </p>
            {(leadData?.status === 'Disbursed' ||
              leadData?.status === 'Part_Payment' ||
              leadData?.status === 'Settlement') && (
              <div className="flex flex-row">
                <PrimaryCTA
                  ctaText="Add collection timeline"
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  viewStyle="mr-4"
                />
                {user?.role !== 'Tele_Caller' &&
                  leadData.waiverApprovalStatus === 'None' && (
                    <PrimaryCTA
                      ctaText="Request Waiver/Settlement"
                      onClick={() => setIsWaiverModalOpen(true)}
                    />
                  )}
                {leadData.waiverApprovalStatus === 'Requested' && (
                  <Badge color="yellow">Waiver Requested</Badge>
                )}
                {leadData.waiverApprovalStatus === 'Accepted' && (
                  <Badge color="red">Waiver Rejected</Badge>
                )}
                {leadData.waiverApprovalStatus === 'Accepted' && (
                  <Badge color="green">Waiver Requested</Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <ol className="relative border-l border-gray-200">
          {collectionTimelineData?.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Metric className="text-3xl font-semibold text-gray-400 my-4">
                No collection timeline
              </Metric>
            </div>
          ) : (
            collectionTimelineData?.map(lineItem => (
              <li className="mb-10 ml-6" key={lineItem.id}>
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -left-3 ring-8 ring-white">
                  <TbUser className="h-1/2 w-1/2" />
                </span>
                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                  <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                    {format(parseISO(lineItem.createdAt), 'hh:mm:ss')}
                  </time>
                  <div className="text-sm font-normal text-gray-500 flex flex-1 flex-col">
                    <div className="text-tremor-default font-semibold text-gray-900 mb-2">
                      {format(parseISO(lineItem.createdAt), 'do MMMM yyyy')}
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-semibold text-gray-900 mr-1">
                        {lineItem.contactedBy}{' '}
                        <span className="font-normal">called related to</span>{' '}
                        {lineItem.relatedTo}
                      </span>
                    </div>
                    <div className="p-3 mt-4 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 w-4/5">
                      {lineItem.customerResponse}
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ol>
      </div>
      <ModalContainer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        styles="bg-white">
        <div>
          <Title>Collection Timeline</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="relatedTo"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Call Related To"
                  value={value}
                  onChange={onChange}
                  options={[
                    {
                      key: '1',
                      value: 'Customer',
                      label: 'Customer',
                    },
                    {
                      key: '2',
                      value: 'Field vist',
                      label: 'Field vist',
                    },
                    {
                      key: '3',
                      value: 'Reference',
                      label: 'Reference',
                    },
                  ]}
                />
              )}
            />
            <Controller
              name="customerResponse"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Call Response"
                  value={value}
                  onChange={onChange}
                  options={CallResponseCodes}
                  disabled={!!loading}
                  errorMessage={errors.customerResponse?.message}
                />
              )}
            />
          </div>
          <div className="w-full flex justify-end">
            <PrimaryCTA
              ctaText="Submit"
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isWaiverModalOpen}
        onClose={() => setIsWaiverModalOpen(false)}
        styles="bg-white">
        <div>
          <Title>Waiver Request</Title>
          <div className="flex flex-col mt-4">
            <Controller
              name="waiverAmountType"
              control={waiverRequestControl}
              render={({ field: { onChange, value } }) => (
                <InputSelect
                  label="Request Type"
                  value={value}
                  onChange={onChange}
                  options={WaiverRequestType}
                  disabled={!!loading}
                  errorMessage={waiverRequestErrors.waiverAmountType?.message}
                />
              )}
            />
            <Controller
              name="waiverAmount"
              control={waiverRequestControl}
              render={({ field: { onChange, value } }) => (
                <NumberInputContainer
                  label="Waiver Amount"
                  placeholder="Enter waiver amount"
                  onChange={onChange}
                  value={value}
                  errorMessage={waiverRequestErrors.waiverAmount?.message}
                  disabled={!!loading}
                />
              )}
            />
          </div>
          <div className="w-full flex justify-end">
            <PrimaryCTA
              ctaText="Submit"
              loading={loading}
              onClick={waiverRequestHandleSubmit(requestWaiver)}
            />
          </div>
        </div>
      </ModalContainer>
    </Card>
  );
};

export default CollectionTimeline;
