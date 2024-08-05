type IButtonProps = {
  xl?: boolean;
  children: string;
};

const ApplyNowCTA = (props: IButtonProps) => {
  return (
    <div className="bg-primaryColor text-white py-4 lg:text-xl md:text-lg text-xl font-medium lg:w-48 md:w-36 w-48 rounded-full flex items-center justify-center">
      {props.children}
    </div>
  );
};

export default ApplyNowCTA;
