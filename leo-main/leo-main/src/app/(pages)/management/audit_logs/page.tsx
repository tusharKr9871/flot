'use client';

import AuditLogsTable from '@/components/audit-logs-table';
import TableLoader from '@/components/table-loader';
import { useAuditLogs } from '@/hooks/audit-logs-api';
import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuditLogs = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();

  const { auditLogsData, isFetchingAuditLogsData } = useAuditLogs({
    pageNumber,
  });

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  return (
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>Audit Logs</Metric>
          </div>
          {isFetchingAuditLogsData ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <AuditLogsTable
              tableData={auditLogsData?.auditLogs || []}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              total={auditLogsData?.auditLogsCount || 1}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default AuditLogs;
