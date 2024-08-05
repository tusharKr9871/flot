'use client';

import UserDataTable from '@/components/user-data-table';
import { Card, Metric } from '@tremor/react';
import PrimaryCTA from '@/components/primary-cta';
import { useEffect, useState } from 'react';
import ModalContainer from '@/components/modal';
import UserForm from './user-form';
import { useFetchUsers } from '@/hooks/user-api';
import TableLoader from '@/components/table-loader';
import { useAuth } from '@/context/AuthContextProvider';
import { useRouter } from 'next/navigation';
import SearchBox from '@/components/search-box';

const UserManagemment = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { allUsers, isFetchingUsers } = useFetchUsers({
    pageNumber,
    searchTerm,
  });

  const router = useRouter();

  useEffect(() => {
    router.push(`?page=${pageNumber}`);
  }, [router, pageNumber]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <div className="md:px-14 mx-2 pt-4 pb-4">
        <Card className="h-auto flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <Metric>Users</Metric>
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
          {isFetchingUsers ? (
            <div className="h-full mt-8">
              <TableLoader />
            </div>
          ) : (
            <UserDataTable
              tableData={allUsers?.users || []}
              isEditable={user?.role === 'Admin' ? true : false}
              totalUsers={allUsers?.userCount || 1}
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
        <UserForm setIsModalOpen={setIsModalOpen} />
      </ModalContainer>
    </>
  );
};

export default UserManagemment;
