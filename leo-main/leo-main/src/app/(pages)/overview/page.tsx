'use client';

import DisbursalRoleBarChart from '@/components/disbursal-role-bar-chart';
import AdminPerformanceHistory from '@/components/admin-performance-history';
import CollectionRoleBarChart from '@/components/collection-role-bar-chart';
import KpiCards from '@/components/kpi-cards';
import { Metric } from '@tremor/react';
import { useAuth } from '@/context/AuthContextProvider';
import InputSelect from '@/components/input-select';
import { useState } from 'react';
import DisbursalReportTable from '@/components/disbursal-report-table';
import CollectionReportTable from '@/components/collection-report-table';
import AdminPerformanceHistoryTable from '@/components/admin-performance-history-table';
import DisbursalReloanFreshTable from '@/components/disbursal-reloan-fresh-table';
import AdminCollectionDailyTrack from '@/components/admin-collection-track';
import TeleCallerPerformance from '@/components/telecaller-performance';
import TeleCallerPerformanceTable from '@/components/telecaller-performance-table';

import CreditManagerDisbursalLineChart from '@/components/credit-manager-disbursal-performance';
import CreditManagerDisbursalTable from '@/components/credit-manager-disbursal-table';
import CollectionExecutiveBarChart from '@/components/collection-executive-data-report';
import CollectionExecutiveDataTable from '@/components/collection-executive-data-table.tsx';

const Overview = () => {
  const { user } = useAuth();
  const [overviewType, setOverviewType] = useState('graph');
  return (
    <>
      <div className="md:px-14 mx-2 md:pt-20 pt-10 h-auto pb-10">
        <Metric>Dashboard</Metric>
        <div className="mt-6">
          <div className="mb-6">
            <KpiCards />
          </div>
        </div>
        {(user?.role === 'Tele_Caller' ||
          user?.role === 'Admin' ||
          user?.role === 'Credit_Manager' ||
          user?.role === 'Collection_Manager') && (
          <>
            <div className="flex flex-row justify-end mt-6">
              <div className="w-1/5">
                <InputSelect
                  options={[
                    {
                      key: '1',
                      label: 'Graphical',
                      value: 'graph',
                    },
                    {
                      key: '2',
                      label: 'Numerical',
                      value: 'numeric',
                    },
                  ]}
                  value={overviewType}
                  onChange={setOverviewType}
                  enableClear={false}
                />
              </div>
            </div>
          </>
        )}
        {user?.role === 'Tele_Caller' && (
          <>
            <div>
              {overviewType === 'graph' ? (
                <TeleCallerPerformance />
              ) : (
                <TeleCallerPerformanceTable />
              )}
            </div>
          </>
        )}
        {(user?.role === 'Credit_Manager' || user?.role === 'Loan_Officer') && (
          <>
            {overviewType === 'graph' ? (
              <CreditManagerDisbursalLineChart color={['indigo']} />
            ) : (
              <CreditManagerDisbursalTable />
            )}
          </>
        )}
        {user?.role === 'Collection_Manager' && (
          <>
            {overviewType === 'graph' ? (
              <CollectionExecutiveBarChart color={['indigo', 'red']} />
            ) : (
              <>
                <div className="mt-6">
                  <AdminCollectionDailyTrack />
                </div>
                <div className="mt-6">
                  <CollectionExecutiveDataTable />
                </div>
              </>
            )}
          </>
        )}
        {user?.role === 'Admin' && (
          <>
            {overviewType === 'graph' ? (
              <>
                <div>
                  <AdminPerformanceHistory />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <DisbursalRoleBarChart
                    role="Credit_Manager"
                    color={['blue', 'red']}
                  />
                  <DisbursalRoleBarChart
                    role="Loan_Officer"
                    color={['blue', 'red']}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <CollectionRoleBarChart
                    role="Credit_Manager"
                    color={['indigo', 'red']}
                  />
                  <CollectionRoleBarChart
                    role="Tele_Caller"
                    color={['indigo', 'red']}
                  />
                </div>
                <div className="mt-6">
                  <CollectionRoleBarChart
                    role="Collection_Manager"
                    color={['indigo', 'red']}
                  />
                </div>
                <div className="mt-6">
                  <CollectionRoleBarChart
                    role="Collection_Executive"
                    color={['indigo', 'red']}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <AdminPerformanceHistoryTable />
                </div>
                <div className="mt-6">
                  <DisbursalReportTable />
                </div>
                <div className="mt-6">
                  <DisbursalReloanFreshTable />
                </div>
                <div className="mt-6">
                  <AdminCollectionDailyTrack />
                </div>
                <div className="mt-6">
                  <CollectionReportTable />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Overview;
