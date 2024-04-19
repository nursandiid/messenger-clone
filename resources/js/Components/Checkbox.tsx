import { InputHTMLAttributes } from "react";

export default function Checkbox({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} type="checkbox" className={"checkbox " + className} />
  );
}
