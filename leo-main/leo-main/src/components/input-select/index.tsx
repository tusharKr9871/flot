import { Select, SelectItem } from '@tremor/react';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';

export type Option = {
  key: string;
  value: string;
  label: string;
};

const InputSelect = ({
  styles,
  label,
  id,
  options,
  value,
  defaultValue,
  onChange,
  errorMessage,
  disabled,
  enableClear,
}: {
  styles?: string;
  label?: string;
  id?: string;
  options: Option[];
  value: string;
  defaultValue?: string;
  onChange: Dispatch<SetStateAction<string>>;
  errorMessage?: string;
  disabled?: boolean;
  enableClear?: boolean;
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
      <Select
        value={value}
        onValueChange={onChange}
        defaultValue={defaultValue}
        className={classNames('w-full', !!errorMessage && 'border-red-500')}
        disabled={disabled}
        enableClear={enableClear}>
        {options.map(option => (
          <SelectItem value={option.value} key={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputSelect;
