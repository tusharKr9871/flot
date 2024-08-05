'use client';

import BranchTargetTable from '@/components/branch-target-table';
import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import { useBranchTarget } from '@/hooks/target-api';
import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BranchTargetForm from './branch-target-form';

const BranchWiseTarget = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { branchTargetData, isFetchingBranchTargetData } = useBranchTarget({
    pageNumber,
    searchTerm,
  });

  const router = useRouter();

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>Branch Wise Targets</Metric>
            <div className="flex flex-row items-center justify-center">
              <SearchBox
                value={searchTerm}
                onChange={setSearchTerm}
                setPageNumber={setPageNumber}
              />
              <PrimaryCTA
                onClick={() => setIsModalOpen(true)}
                ctaText="Add"
                icon="plus"
                viewStyle="ml-4"
              />
            </div>
          </div>
          {isFetchingBranchTargetData ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <BranchTargetTable
              tableData={branchTargetData?.allBranchTargets || []}
              totalLeads={branchTargetData?.count || 1}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          )}
        </Card>
      </div>
      <ModalContainer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        styles="bg-white">
        <BranchTargetForm setModalState={setIsModalOpen} />
      </ModalContainer>
    </>
  );
};

export default BranchWiseTarget;
