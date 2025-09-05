import React, { useRef } from "react";
import { FaSearch } from "react-icons/fa";

interface InputProps {
  width?: string;
  height?: string;
  py?: string;
  px?: string;
  border?: string;
  type?: React.HTMLInputTypeAttribute;
  max_width?: string;
  placeholder: string;
  label?: string;
  border_radius?: string;
  left_content?: boolean;
  gap?: string;
  right_content?: string;
}

const Input = ({
  width = "384px",
  height,
  py = "12px",
  px = "12px",
  border = "1px solid #d1d5db",
  type = "text",
  placeholder,
  label,
  border_radius = "8px",
  ...props
}: InputProps) => {
  const iconRef = useRef<HTMLSpanElement>();
  return (
    <div className="flex flex-col gap-1 items-start w-full">
      <label
        htmlFor={label}
        id={label}
        className="text-black font-semibold text-base"
      >
        {label}
      </label>
      {props.left_content ? (
        <div className="flex relative">
          <span ref={() => iconRef}>
              <FaSearch className="absolute top-4 left-3" />
          </span>
          <input
            type={type}
            style={{
              width: width ?? "100%",
              paddingBlock: py,
              paddingInline: px,
              border: border,
              height: height,
              maxWidth: props.max_width,
              borderRadius: border_radius,
              paddingLeft: props.left_content ? "10px" : px,
              paddingRight: props.right_content ? "10px" : px,
            }}
            placeholder={placeholder}
            className={`focus:outline-none ${
              props.left_content && "placeholder:pl-7"
            }`}
          />
        </div>
      ) : props.right_content ? (
        <div className="flex relative">
          <input
            type={type}
            style={{
              width: width ?? "100%",
              paddingBlock: py,
              paddingInline: px,
              border: border,
              height: height,
              maxWidth: props.max_width,
              borderRadius: border_radius,
            }}
            placeholder={placeholder}
            className="focus:outline-none"
          />
          <FaSearch className="absolute top-4 left-1" />
        </div>
      ) : (
        <input
          type={type}
          style={{
            width: width ?? "100%",
            paddingBlock: py,
            paddingInline: px,
            border: border,
            height: height,
            maxWidth: props.max_width,
            borderRadius: border_radius,
          }}
          placeholder={placeholder}
          className="focus:outline-none"
        />
      )}
    </div>
  );
};

export default Input;
