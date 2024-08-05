import classNames from "classnames";

const FormStepper = ({ formStep }: { formStep: number }) => {
  return (
    <div className="w-full">
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 xs:text-base">
        <li
          className={classNames(
            `flex w-full items-center xs:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden xs:after:inline-block after:mx-6 xl:after:mx-10`,
            (formStep == 0 || formStep > 0) && "text-primaryColor",
            formStep > 0 && "after:border-primaryColor"
          )}
        >
          <span className="flex items-center after:content-['/'] xs:after:hidden after:mx-2 after:text-gray-200">
            {formStep > 0 ? (
              <CheckCircleIcon />
            ) : (
              <span className="mr-2">1</span>
            )}
            Verify <span className="hidden xs:inline-flex xs:ml-2">Phone</span>
          </span>
        </li>
        <li
          className={classNames(
            `flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden xs:after:inline-block after:mx-6 xl:after:mx-10`,
            (formStep === 1 || formStep > 1) && "text-primaryColor",
            formStep > 1 && "after:border-primaryColor"
          )}
        >
          <span className="flex items-center after:content-['/'] xs:after:hidden after:mx-2 after:text-gray-200">
            {formStep > 1 ? (
              <CheckCircleIcon />
            ) : (
              <span className="mr-2">2</span>
            )}
            Personal <span className="hidden xs:inline-flex xs:ml-2">Info</span>
          </span>
        </li>
        <li
          className={classNames(
            `flex items-center`,
            formStep === 2 && "text-primaryColor"
          )}
        >
          <span className="mr-2">
            {formStep == 2 ? (
              <CheckCircleIcon />
            ) : (
              <span className="mr-2">3</span>
            )}
          </span>
          Summary
        </li>
      </ol>
    </div>
  );
};

export default FormStepper;

const CheckCircleIcon = () => (
  <svg
    className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>
);
