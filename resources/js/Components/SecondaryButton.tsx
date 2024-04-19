import { ButtonHTMLAttributes } from "react";

export default function SecondaryButton({
  type = "button",
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      className={`btn btn-secondary ${disabled && "opacity-25"} ` + className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
