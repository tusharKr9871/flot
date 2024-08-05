import { Dispatch, SetStateAction } from 'react';

const Checkbox = ({
  value = false,
  label,
  onChange,
}: {
  value?: boolean;
  label: string;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center">
      <input
        id="default-checkbox"
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.value)}
        className="w-4 h-4 text-secondaryColor bg-gray-100 border-gray-300 rounded-lg"
      />
      <label
        htmlFor="default-checkbox"
        className="block text-sm font-medium text-gray-700/[0.6] ml-2">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
