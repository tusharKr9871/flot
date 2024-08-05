import { Metric } from '@tremor/react';

const NoTableDataFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <div className="flex flex-col justify-center items-center">
        <Metric className="text-3xl font-semibold text-gray-400">
          No Data Found
        </Metric>
      </div>
    </div>
  );
};

export default NoTableDataFound;
