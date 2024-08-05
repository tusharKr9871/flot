import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useDebounce } from '@/utils/use-debounce';

export type UserDataType = {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  branch: string;
  role: string;
  status: string;
  otp: number;
  otpExpiry: string;
  reporting: string;
  collectionUser: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type UsersApiDataType = {
  users: UserDataType[];
  userCount: number;
};

type Option = {
  key: string;
  value: string;
  label: string;
};

export const useFetchUsers = ({
  pageNumber = 1,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;
  const url = `/user/all?limit=${limit}&offset=${offset}`;

  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const {
    data: allUsers,
    error: fetchUsersError,
    mutate: revalidateUser,
    isLoading: isFetchingUsers,
  } = useSWR<UsersApiDataType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return { allUsers, fetchUsersError, revalidateUser, isFetchingUsers };
};

export const useFetchUsersByRoleAndBranch = ({
  role,
  branch,
}: {
  role: string;
  branch?: string;
}) => {
  const url = `/user/get/role/${role}`;
  const {
    data: usersByRoleAndBranchData,
    error: fetchUsersByRoleAndBranchError,
    mutate: revalidateUsersByRoleAndBranch,
    isLoading: isFetchingUsersByRoleAndBranch,
  } = useSWR<Option[]>(branch ? url + `?branch=${branch}` : url, fetcher);

  return {
    usersByRoleAndBranchData,
    fetchUsersByRoleAndBranchError,
    revalidateUsersByRoleAndBranch,
    isFetchingUsersByRoleAndBranch,
  };
};

export const useFetchReassignUsersByRoleAndBranch = ({
  role,
  branch,
}: {
  role: string;
  branch?: string;
}) => {
  const url = `/user/get/reassign/${role}`;
  const {
    data: usersByRoleAndBranchData,
    error: fetchUsersByRoleAndBranchError,
    mutate: revalidateUsersByRoleAndBranch,
    isLoading: isFetchingUsersByRoleAndBranch,
  } = useSWR<Option[]>(branch ? url + `?branch=${branch}` : url, fetcher);

  return {
    usersByRoleAndBranchData,
    fetchUsersByRoleAndBranchError,
    revalidateUsersByRoleAndBranch,
    isFetchingUsersByRoleAndBranch,
  };
};
