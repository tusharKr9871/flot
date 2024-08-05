import { TextInput } from '@tremor/react';
import { Dispatch, SetStateAction } from 'react';
import { TbSearch } from 'react-icons/tb';

const SearchBox = ({
  value,
  onChange,
  setPageNumber,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div>
      <TextInput
        placeholder="Search"
        icon={TbSearch}
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setPageNumber(1);
        }}
      />
    </div>
  );
};

export default SearchBox;
