import { Transition } from "@headlessui/react";
import clsx from "clsx";

type DragFileOverlayProps = {
  onDrag: boolean;
  onDrop: boolean;
};

export default function DragFileOverlay({
  onDrag,
  onDrop,
}: DragFileOverlayProps) {
  return (
    <Transition
      show={onDrag}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute bottom-0 top-0 z-20 flex w-full items-center justify-center bg-secondary/60 text-2xl text-foreground/25 sm:text-3xl">
        <p
          className={clsx(
            "-mt-[52px] rounded-lg px-4 py-2",
            onDrop ? "bg-secondary/25" : "bg-secondary",
          )}
        >
          Drag file here
        </p>
      </div>
    </Transition>
  );
}
