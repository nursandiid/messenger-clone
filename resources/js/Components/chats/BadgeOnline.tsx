import clsx from "clsx";

export default function BadgeOnline({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "absolute bottom-1 right-1 h-2 w-2 rounded-full bg-success ring-2 ring-white dark:bg-success-dark dark:ring-gray-200",
        className,
      )}
    />
  );
}
