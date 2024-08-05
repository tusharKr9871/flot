'use client';

import { useFetchCustomerServices } from '@/hooks/services-api';
import { Card, Flex, Grid, Metric, Text } from '@tremor/react';

const ActiveServices = () => {
  const { servicesData, isFetchingServicesData } = useFetchCustomerServices();

  console.log("debug::service::data:debug:9:", servicesData);

  if (isFetchingServicesData) {
    <div className="md:px-14 mx-2 md:pt-20 pt-10 h-auto pb-10">
      <Metric>Active Services</Metric>
      <Card className="animate-pulse">
        <Flex alignItems="start">
          <div className="truncate">
            <div className="h-2.5 w-1/3 bg-gray-200"></div>
            <div className="h-4 w-2/3 bg-gray-200"></div>
          </div>
        </Flex>
        <Flex className="mt-4 space-x-2">
          <div className="h-2.5 w-1/3 bg-gray-200"></div>
          <div className="h-2.5 w-1/3 bg-gray-200"></div>
        </Flex>
      </Card>
    </div>;
  }
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
      <div className="md:px-14 mx-2 md:pt-20 pt-10 h-auto pb-10">
        <Metric>Active Services</Metric>
        <Card className="mt-4">
          <Text>OTP SMS Balance</Text>
          <Metric className="truncate text-gray-600">
            ₹{servicesData?.balance}
          </Metric>
        </Card>
      </div>
    </Grid>
  );
};

export default ActiveServices;
