import clsx from "clsx";

type FormAlertProps = {
  message: string;
  className?: string;
};

export default function FormAlert({ message, className }: FormAlertProps) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-success/25 px-4 py-3 font-medium text-success-dark dark:bg-success/10",
        className,
      )}
    >
      {message}
    </div>
  );
}
