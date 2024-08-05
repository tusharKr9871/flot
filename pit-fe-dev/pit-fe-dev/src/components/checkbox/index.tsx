import { Dispatch, SetStateAction } from "react";

const Checkbox = ({
  label,
  onChange,
}: {
  label: string;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-start mb-4">
      <input
        id="default-checkbox"
        type="checkbox"
        value="true"
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4 text-secondaryColor bg-gray-100 border-gray-300 rounded-lg"
      />
      <label
        htmlFor="default-checkbox"
        className="block xs:text-sm text-xs font-medium text-gray-700/[0.6] ml-2"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
