import { Dispatch, SetStateAction } from 'react';

const TimePicker = ({
  styles,
  label,
  id,
  selectedTime,
  setSelectedTime,
  errorMessage,
}: {
  styles?: string;
  label: string;
  id?: string;
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string>>;
  errorMessage?: string;
}) => {
  return (
    <div className={`mb-4 w-full ${styles}`}>
      <div className="flex flex-col items-start">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700/[0.6] mb-2">
            {label}
          </label>
        )}
        <input
          type="time"
          id="time"
          value={selectedTime}
          onChange={e => setSelectedTime(e.target.value)}
          className="w-full px-3 py-[7px] shadow-sm rounded-md text-tremor-default border border-gray-200 focus:outline-none focus:ring-2 focus:border-blue-300 focus:border-[0.5px]"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
