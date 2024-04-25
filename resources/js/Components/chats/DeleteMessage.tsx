import clsx from "clsx";
import { BsTrash } from "react-icons/bs";

type DeleteMessageProps = {
  className?: string;
};

export default function DeleteMessage({ className }: DeleteMessageProps) {
  const deleteConfirmation = () => {
    // TODO: delete message confirmation
  };

  return (
    <div
      className={clsx(
        "invisible flex flex-shrink-0 gap-2 group-hover:visible group-focus:visible",
        className,
      )}
    >
      <button
        type="button"
        className="btn btn-secondary rounded-full p-2"
        onClick={deleteConfirmation}
      >
        <BsTrash />
      </button>
    </div>
  );
}
