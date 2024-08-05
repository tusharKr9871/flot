import { TextInput } from '@tremor/react';
import { Dispatch, SetStateAction } from 'react';

const InputContainer = ({
  styles,
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  maxLength,
  errorMessage,
  disabled,
  autoFocus = false,
  pan,
}: {
  styles?: string;
  label: string;
  id?: string;
  type: 'text' | 'password' | 'url' | 'email';
  placeholder: string;
  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
  maxLength?: number;
  errorMessage?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  pan?: boolean;
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
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={e =>
          pan
            ? onChange(e.target.value.toUpperCase())
            : onChange(e.target.value)
        }
        type={type}
        maxLength={maxLength}
        error={!!errorMessage}
        errorMessage={errorMessage}
        disabled={disabled}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default InputContainer;
