import { NumberInput } from '@tremor/react';
import { Dispatch, SetStateAction } from 'react';

const NumberInputContainer = ({
  styles,
  label,
  id,
  placeholder,
  value,
  onChange,
  max,
  errorMessage,
  disabled,
}: {
  styles?: string;
  label: string;
  id?: string;
  placeholder: string;
  value?: number;
  onChange: Dispatch<SetStateAction<number>>;
  max?: number;
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
      <NumberInput
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.valueAsNumber)}
        max={max}
        enableStepper={false}
        className="w-full"
        error={!!errorMessage}
        errorMessage={errorMessage}
        disabled={disabled}
        maxLength={max?.toString().length}
      />
    </div>
  );
};

export default NumberInputContainer;
