import useSWR from 'swr';
import { fetcher } from './fetcher';
import { useDebounce } from '@/utils/use-debounce';

export type BranchTargetType = {
  id: string;
  target: number;
  branchName: string;
  approvedBy: string;
  month: string;
  createdAt: string;
  updatedAt: string;
};

type BranchTargetTypeApi = {
  allBranchTargets: BranchTargetType[];
  count: number;
};

export type SanctionTargetType = {
  id: string;
  target: number;
  approvedBy: string;
  sanctionedTo: {
    id: string;
    name: string;
  };
  month: string;
  createdAt: string;
  updatedAt: string;
};

type SanctionTargetApiType = {
  allSanctionTargets: SanctionTargetType[];
  count: number;
};

export const useBranchTarget = ({
  pageNumber,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;

  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const url = `/branch-target/get?limit=${limit}&offset=${offset}`;

  const {
    data: branchTargetData,
    error: fetchBranchTargetError,
    mutate: revalidateBranchTargetData,
    isLoading: isFetchingBranchTargetData,
  } = useSWR<BranchTargetTypeApi>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    branchTargetData,
    fetchBranchTargetError,
    revalidateBranchTargetData,
    isFetchingBranchTargetData,
  };
};

export const useSanctionTarget = ({
  pageNumber,
  searchTerm,
}: {
  pageNumber: number;
  searchTerm?: string;
}) => {
  const limit = 10;
  const offset = (pageNumber - 1) * 10;

  const debouncedSearch = useDebounce(
    encodeURIComponent(searchTerm || ''),
    500,
  );

  const url = `/sanction-target/get?limit=${limit}&offset=${offset}`;

  const {
    data: sanctionTargetData,
    error: fetchBranchTargetError,
    mutate: revalidatesanctionTargetData,
    isLoading: isFetchingsanctionTargetData,
  } = useSWR<SanctionTargetApiType>(
    debouncedSearch ? url + `&search=${debouncedSearch}` : url,
    fetcher,
  );

  return {
    sanctionTargetData,
    fetchBranchTargetError,
    revalidatesanctionTargetData,
    isFetchingsanctionTargetData,
  };
};
