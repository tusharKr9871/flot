import { useCallback } from "react";
import {
  TbChevronLeft,
  TbEdit,
  TbFileSpreadsheet,
  TbMinus,
  TbPlus,
  TbSend,
} from "react-icons/tb";
import classNames from "classnames";

const SecondaryCTA = ({
  onClick,
  ctaText,
  disabled,
  icon,
  viewStyle = "",
}: {
  onClick: () => void;
  ctaText: string;
  disabled?: boolean;
  icon?: "plus" | "minus" | "edit" | "confirm" | "export" | "send" | "back";
  viewStyle?: string; //container style
}) => {
  const renderIcon = useCallback((iconType: string) => {
    switch (iconType) {
      case "plus":
        return <TbPlus />;
      case "export":
        return <TbFileSpreadsheet />;
      case "edit":
        return <TbEdit />;
      case "send":
        return <TbSend />;
      case "minus":
        return <TbMinus />;
      case "back":
        return <TbChevronLeft />;
    }
  }, []);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "text-primaryColor border-primaryColor border-[0.5px] bg-white rounded-md px-4 py-2 shadow-sm min-w-[78px] flex items-center justify-center",
        viewStyle
      )}
      name="secondary-cta"
    >
      <div className="flex flex-row items-center">
        <span className={classNames("font-semibold text-sm", icon && "mr-2")}>
          {ctaText}
        </span>
        {icon && (
          <span className="font-semibold text-sm">{renderIcon(icon)}</span>
        )}
      </div>
    </button>
  );
};

export default SecondaryCTA;
