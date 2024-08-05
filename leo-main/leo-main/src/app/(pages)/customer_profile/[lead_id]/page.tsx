'use client';

import CustomerCard from '@/components/customer-card';
import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';
import { ObjectType } from '@/shared/shared-types';
import { ProfileTab } from './profile';
import Timeline from './timeline';
import ApprovalAndDisbursal from './approval-and-disbursal';
import Collection from './collection';
import LoanHistory from './loan-history';
import LeadHistory from './lead-history';
import { CustomerProfileTabData } from '@/mock/mockData';
import { useFetchCustomerByLead } from '@/hooks/customer-api';

const UserProfileForLead = ({ params }: { params: { lead_id: string } }) => {
  const { lead_id } = params;

  const { customerData } = useFetchCustomerByLead({
    leadId: lead_id,
  });

  return (
    <div className="flex flex-col lg:flex-row md:px-6 px-4 lg:py-10 py-4 h-full">
      <title>{customerData?.customerName}</title>
      <div className="flex lg:w-[25%] lg:mr-6 w-full pb-8 lg:pb-0 h-full">
        <CustomerCard leadId={lead_id} isEditable={true} />
      </div>
      <div className="flex lg:w-[75%] w-full max-h-max lg:pb-0 pb-9">
        <Card>
          <TabGroup>
            <TabList color="orange">
              {CustomerProfileTabData.map((tab: ObjectType) => (
                <Tab key={tab.key}>{tab.value}</Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="mt-8">
                  <ProfileTab leadId={lead_id} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-8">
                  <Timeline leadId={lead_id} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-8">
                  <ApprovalAndDisbursal leadId={lead_id} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-8">
                  <Collection leadId={lead_id} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-8">
                  <LoanHistory leadId={lead_id} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-8">
                  <LeadHistory leadId={lead_id} />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileForLead;
