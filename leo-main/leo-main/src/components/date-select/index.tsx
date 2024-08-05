import { DatePicker } from '@tremor/react';
import { Dispatch, SetStateAction } from 'react';

const DateSelect = ({
  styles,
  label,
  id,
  placeholder,
  value,
  onChange,
  errorMessage,
  disabled,
}: {
  styles?: string;
  label: string;
  id?: string;
  placeholder: string;
  value: Date | undefined;
  onChange: Dispatch<SetStateAction<Date | undefined>>;
  errorMessage?: string;
  disabled?: boolean;
}) => {
  return (
    <div className={`mb-4 w-full ${styles}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700/[0.6] mb-2">
          {label}
        </label>
      )}
      <DatePicker
        placeholder={placeholder}
        value={value}
        onValueChange={onChange}
        enableYearNavigation={true}
        weekStartsOn={1}
        className="w-full"
        disabled={disabled}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default DateSelect;
