import { SanctionTargetType } from '@/hooks/target-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import Pagination from '../pagination';
import { formatIndianNumber } from '@/utils/utils';
import ModalContainer from '../modal';
import SanctionTargetForm from '@/app/(pages)/management/sanctionwise_targets/sanction-target-form';
import NoTableDataFound from '../no-table-data-found';
import classNames from 'classnames';

const SanctionTargetTable = ({
  tableData,
  totalLeads,
  pageNumber,
  setPageNumber,
}: {
  tableData: SanctionTargetType[];
  totalLeads: number;
  pageNumber: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [sanctionTarget, setSanctionTarget] = useState<SanctionTargetType>();

  if (tableData.length === 0) {
    return <NoTableDataFound />;
  }

  return (
    <>
      <Table className="h-[90%] mt-4">
        <TableHead>
          <TableRow className="border-b-2">
            <TableHeaderCell className="bg-white"></TableHeaderCell>
            <TableHeaderCell className="bg-white">
              Sanction Officer
            </TableHeaderCell>
            <TableHeaderCell className="bg-white">Target</TableHeaderCell>
            <TableHeaderCell className="bg-white">Month</TableHeaderCell>
            <TableHeaderCell className="bg-white"></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-slate-600">
          {tableData.map((item, index) => (
            <TableRow
              key={item.id}
              className={classNames(index % 2 === 0 && 'bg-gray-100')}>
              <TableCell></TableCell>
              <TableCell>{item.sanctionedTo.name}</TableCell>
              <TableCell>{formatIndianNumber(item.target)}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>
                <span
                  className="text-2xl cursor-pointer"
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setSanctionTarget(item);
                  }}>
                  <TbEdit />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row flex-1 item-center justify-start">
        <Pagination
          currentPage={pageNumber}
          totalPages={
            Math.ceil(totalLeads / 10) === 0 ? 1 : Math.ceil(totalLeads / 10)
          }
          totalItems={totalLeads}
          onPageChange={setPageNumber}
        />
      </div>
      <ModalContainer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        styles="bg-white">
        <SanctionTargetForm
          defaultValue={sanctionTarget}
          setModalState={setIsEditModalOpen}
        />
      </ModalContainer>
    </>
  );
};

export default SanctionTargetTable;
