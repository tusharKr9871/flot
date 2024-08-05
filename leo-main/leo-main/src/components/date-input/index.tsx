const DateInput = ({
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
          className="block text-sm font-medium text-gray-700/[0.6] mb-2">
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        // onClick={(e) => e.preventDefault()}
        className="w-full px-4 py-1.5 border text-medium text-gray-600 border-gray-300 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/[0.5]"
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default DateInput;
