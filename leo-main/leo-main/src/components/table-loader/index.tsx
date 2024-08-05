import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
} from '@tremor/react';

const TableLoader = () => {
  return (
    <Table className="animate-pulse">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
          <TableHeaderCell className="bg-white">
            <div className="h-2.5 bg-gray-200 rounded-full mb-2 w-4/5"></div>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody></TableBody>
    </Table>
  );
};

export default TableLoader;
