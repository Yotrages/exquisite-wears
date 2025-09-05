import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Success from "./Success";

interface InputProps {
  width?: string;
  height?: string;
  py?: string;
  px?: string;
  border?: string;
  type?: React.HTMLInputTypeAttribute;
  max_width?: string;
  placeholder?: string;
  label?: string;
  border_radius?: string;
  gap?: string;
}

const PasswordInput = ({
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
    const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1 items-start w-full">
      <label
        htmlFor={label}
        id={label}
        className="text-black font-semibold text-base"
      >
        {label}
      </label>
      <div className="flex relative">
          <input
            type={show ? type : "password"}
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
            <div onClick={() => setShow(true)} className="absolute cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center top-3 right-3 w-[30px] h-[30px] rounded-full bg-black/5">
            {show ? <FaEyeSlash /> : <FaEye />}
            </div>
        </div>
        <Success show={show} setShow={setShow}/>
    </div>
  );
};

export default PasswordInput;
