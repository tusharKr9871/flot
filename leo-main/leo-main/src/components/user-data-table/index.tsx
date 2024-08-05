'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Title,
  Divider,
} from '@tremor/react';
import { TbCopy, TbEdit } from 'react-icons/tb';
import ModalContainer from '../modal';
import { Dispatch, SetStateAction, useState } from 'react';
import { enumCleaner, truncateText } from '@/utils/utils';
import UserForm, {
  UserFormTypes,
} from '@/app/(pages)/management/user_management/user-form';
import {
  UserDataType,
  useFetchUsers,
  useFetchUsersByRoleAndBranch,
} from '@/hooks/user-api';
import { format, parseISO } from 'date-fns';
import Pagination from '../pagination';
import InputSelect from '../input-select';
import PrimaryCTA from '../primary-cta';
import { axiosInstance } from '@/network/axiosInstance';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import classNames from 'classnames';

export type defaultValuesType = UserFormTypes & {
  user_id: string;
};

const UserDataTable = ({
  tableData,
  isEditable = true,
  totalUsers,
  pageNumber,
  setPageNumber,
}: {
  tableData: UserDataType[];
  isEditable?: boolean;
  totalUsers: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, isLoading] = useState(false);
  const [user, setUser] = useState<UserDataType>();
  const [selectedReporting, setSelectedReporting] = useState('');
  const [defaultValue, setDefaultValue] = useState<defaultValuesType>();
  const { usersByRoleAndBranchData } = useFetchUsersByRoleAndBranch({
    role:
      user?.role === 'Collection_Manager'
        ? 'Loan_Officer'
        : user?.role === 'Tele_Caller'
        ? 'Credit_Manager'
        : 'Collection_Manager',
    branch: user?.branch,
  });
  const { revalidateUser } = useFetchUsers({ pageNumber });

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  const onEdit = (option: UserDataType) => {
    setDefaultValue({
      user_id: option.id,
      name: option.fullName,
      email: option.email,
      mobile: option.phoneNo,
      branch: option.branch,
      role: option.role,
      status: option.status,
    });
    setIsModalOpen(true);
  };

  const onChangeReporting = async () => {
    try {
      isLoading(true);
      if (user?.reporting !== 'None' || user.collectionUser !== 'None') {
        await axiosInstance.put('/user-reportee/update-assign', {
          reporteeId: user?.id,
          userId: selectedReporting,
        });
      } else {
        await axiosInstance.post('/user-reportee/assign', {
          reporteeId: user.id,
          userId: selectedReporting,
        });
      }
      toast.success('Reporting Updated!');
      revalidateUser();
      isLoading(false);
      setIsEditModalOpen(false);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Error assigning Reporting!');
    }
  };

  return (
    <>
      <Table className="h-[90%] mt-4">
        <TableHead>
          <TableRow className="border-b-2">
            <TableHeaderCell className="bg-white">Name</TableHeaderCell>
            <TableHeaderCell className="bg-white">Email</TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">Phone No.</TableHeaderCell>
            <TableHeaderCell className="bg-white">Branch</TableHeaderCell>
            <TableHeaderCell className="bg-white">Role</TableHeaderCell>
            <TableHeaderCell className="bg-white">OTP</TableHeaderCell>
            <TableHeaderCell className="bg-white">OTP Expiry</TableHeaderCell>
            <TableHeaderCell className="bg-white">Status</TableHeaderCell>
            <TableHeaderCell className="bg-white">Reporting</TableHeaderCell>
            {/* <TableHeaderCell className="bg-white">
              Collection User
            </TableHeaderCell> */}
            <TableHeaderCell className="bg-white">Created By</TableHeaderCell>
            <TableHeaderCell className="bg-white">Created At</TableHeaderCell>
            <TableHeaderCell className="bg-white">Updated At</TableHeaderCell>
            {isEditable && (
              <TableHeaderCell className="bg-white"></TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              {/* can add popover with full text maybe  */}
              <TableCell>{truncateText(item.fullName, 20)}</TableCell>
              <TableCell>{truncateText(item.email, 20)}</TableCell>
              <TableCell>
                <TbCopy
                  className="text-primaryColor text-lg cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(item.email);
                    toast.success('Email Copied!');
                  }}
                />
              </TableCell>
              <TableCell>{item.phoneNo}</TableCell>
              <TableCell>{item.branch}</TableCell>
              <TableCell>{enumCleaner(item.role)}</TableCell>
              <TableCell className="flex items-center">
                {item.otp}
                <TbCopy
                  className="text-primaryColor text-lg cursor-pointer ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(item.otp.toString());
                    toast.success('OTP Copied!');
                  }}
                />
              </TableCell>
              <TableCell>
                {item.otpExpiry.length !== 0
                  ? format(new Date(parseInt(item.otpExpiry)), 'hh:mm')
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge color={item.status === 'Active' ? 'teal' : 'red'}>
                  {enumCleaner(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-row items-center">
                  {item.reporting}
                  {(item.role === 'Tele_Caller' ||
                    item.role === 'Collection_Executive') &&
                    isEditable && (
                      <span
                        className="text-2xl cursor-pointer ml-2"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setSelectedReporting(item.reporting);
                          setUser(item);
                        }}>
                        <TbEdit />
                      </span>
                    )}
                </div>
              </TableCell>
              {/* <TableCell>
                <div className="flex flex-row items-center">
                  {item.collectionUser}
                  {item.role === 'Collection_Manager' && isEditable && (
                    <span
                      className="text-2xl cursor-pointer ml-2"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setSelectedReporting(item.reporting);
                        setUser(item);
                      }}>
                      <TbEdit />
                    </span>
                  )}
                </div>
              </TableCell> */}
              <TableCell>{item.createdBy}</TableCell>
              <TableCell>
                {format(parseISO(item.createdAt), 'dd-MM-yy hh:mm:ss')}
              </TableCell>
              <TableCell>
                {format(parseISO(item.updatedAt), 'dd-MM-yy hh:mm:ss')}
              </TableCell>
              {isEditable && (
                <TableCell>
                  <span className="text-2xl" onClick={() => onEdit(item)}>
                    <TbEdit />
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalUsers / 10) === 0 ? 1 : Math.ceil(totalUsers / 10)
          }
          totalItems={totalUsers}
          onPageChange={handlePageChange}
        />
      </div>
      <ModalContainer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        styles="bg-white min-w-[18rem]">
        <div className="">
          <Title className="pb-4">Choose Reporting</Title>
          <div>
            <InputSelect
              label="Reporting"
              value={selectedReporting}
              onChange={setSelectedReporting}
              options={usersByRoleAndBranchData || []}
              disabled={!!loading}
            />
            <Divider />
            <div className="flex justify-end w-full">
              <PrimaryCTA
                ctaText="Update"
                onClick={onChangeReporting}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </ModalContainer>
      <ModalContainer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        styles="bg-white">
        <UserForm
          defaultValues={defaultValue}
          fromEdit={true}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalContainer>
    </>
  );
};

export default UserDataTable;
