import { Select, SelectItem } from "@tremor/react";
import classNames from "classnames";

export type Option = {
  key: string;
  value: string;
  label: string;
};

const SelectInput = ({
  styles,
  label,
  id,
  options,
  value,
  onChange,
  errorMessage,
  disabled,
}: {
  styles?: string;
  label?: string;
  id?: string;
  options: Option[];
  value: string;
  onChange: () => void;
  errorMessage?: string;
  disabled?: boolean;
}) => {
  return (
    <div className={`mb-4 w-full ${styles}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700/[0.6] mb-2"
        >
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        className={classNames("w-full", !!errorMessage && "border-red-500")}
        disabled={disabled}
      >
        {options.map((option) => (
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

export default SelectInput;
