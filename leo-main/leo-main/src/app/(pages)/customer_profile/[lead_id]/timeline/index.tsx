'use client';

import CallingStatusCard from '@/components/callingstatus-card';
import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import { useCallHistory } from '@/hooks/call-history-api';
import { enumCleaner, selectPillColor } from '@/utils/utils';
import { Badge, Metric } from '@tremor/react';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { TbUser } from 'react-icons/tb';
import { useFetchLead } from '@/hooks/leads-api';

const Timeline = ({ leadId }: { leadId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { callHistoryForLead, isFetchingCallHistory } = useCallHistory({
    leadId,
  });
  const { leadData } = useFetchLead({ leadId });

  if (isFetchingCallHistory) {
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
    <>
      <div className="flex flex-col">
        <div className="flex flex-row flex-1 justify-end mb-4">
          {leadData?.status !== 'Closed' && (
            <PrimaryCTA
              ctaText="Add call history"
              onClick={() => setIsOpen(true)}
              icon="plus"
              disabled={
                leadData?.status === 'Closed' ||
                leadData?.status === 'Part_Payment' ||
                leadData?.status === 'Settlement' ||
                leadData?.status === 'Bank_Update' ||
                leadData?.status === 'Disbursed'
              }
            />
          )}
        </div>
        <ol className="relative border-l border-gray-200">
          {callHistoryForLead?.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Metric className="text-3xl font-semibold text-gray-400">
                No call history
              </Metric>
            </div>
          ) : (
            callHistoryForLead?.map(lineItem => (
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
                        {lineItem.calledBy}
                      </span>
                      {lineItem.callType}
                      <Badge
                        className="ml-1"
                        color={selectPillColor(enumCleaner(lineItem.status))}>
                        {enumCleaner(lineItem.status)}
                      </Badge>
                    </div>
                    <div className="p-3 mt-4 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 w-4/5">
                      {lineItem.remark}
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
        <CallingStatusCard leadId={leadId} setViewModalOpen={setIsOpen} />
      </ModalContainer>
    </>
  );
};

export default Timeline;
