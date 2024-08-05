'use client';

import ModalContainer from '@/components/modal';
import PrimaryCTA from '@/components/primary-cta';
import SanctionTargetTable from '@/components/sanction-target-table';
import SearchBox from '@/components/search-box';
import TableLoader from '@/components/table-loader';
import { useSanctionTarget } from '@/hooks/target-api';
import { Card, Metric } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SanctionTargetForm from './sanction-target-form';

const SanctionWiseTarget = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { sanctionTargetData, isFetchingsanctionTargetData } =
    useSanctionTarget({
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
            <Metric>Sanction Wise Targets</Metric>
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
          {isFetchingsanctionTargetData ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <SanctionTargetTable
              tableData={sanctionTargetData?.allSanctionTargets || []}
              totalLeads={sanctionTargetData?.count || 1}
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
        <SanctionTargetForm setModalState={setIsModalOpen} />
      </ModalContainer>
    </>
  );
};

export default SanctionWiseTarget;
