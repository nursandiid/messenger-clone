import {
  useState,
  createContext,
  useContext,
  Fragment,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  ButtonHTMLAttributes,
} from "react";
import { Link, InertiaLinkProps } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

const DropDownContext = createContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
}>({
  open: false,
  setOpen: () => {},
  toggleOpen: () => {},
});

export const useDropdownContext = () => useContext(DropDownContext);

const Dropdown = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
      <div className="relative">{children}</div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({ children }: PropsWithChildren) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);

  return (
    <>
      <div onClick={toggleOpen}>{children}</div>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

const Content = ({
  align = "right",
  width = "48",
  contentClasses = "py-1 bg-background",
  children,
}: PropsWithChildren<{
  align?: "left" | "right" | "top-left" | "top-right";
  width?: "48";
  contentClasses?: string;
}>) => {
  const { open, setOpen } = useContext(DropDownContext);

  let alignmentClasses = "origin-top";

  if (align === "left") {
    alignmentClasses = "origin-top-left end-0 sm:start-0 mt-2";
  } else if (align === "right") {
    alignmentClasses = "origin-top-right end-0 mt-2";
  } else if (align === "top-left") {
    alignmentClasses = "origin-bottom-left bottom-0 end-0 sm:start-0 mb-2";
  } else if (align === "top-right") {
    alignmentClasses = "origin-bottom-right bottom-0 end-0 mb-2";
  }

  let widthClasses = "";

  if (width === "48") {
    widthClasses = "w-48";
  }

  return (
    <>
      <Transition
        as={Fragment}
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`absolute z-50 ${alignmentClasses} ${widthClasses}`}
          onClick={() => setOpen(false)}
        >
          <div
            className={
              `rounded-lg bg-background !p-2 shadow-md ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-5 ` +
              contentClasses
            }
          >
            {children}
          </div>
        </div>
      </Transition>
    </>
  );
};

const DropdownLink = ({
  className = "",
  children,
  ...props
}: InertiaLinkProps) => {
  return (
    <Link
      {...props}
      className={
        "block w-full rounded-md px-4 py-2 text-start text-sm leading-5 text-foreground transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none " +
        className
      }
    >
      {children}
    </Link>
  );
};

const DropdownButton = ({
  className = "",
  children,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
  return (
    <button
      {...props}
      className={
        "block w-full rounded-md px-4 py-2 text-start text-sm leading-5 text-foreground transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none " +
        className
      }
    >
      {children}
    </button>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;
Dropdown.Button = DropdownButton;

export default Dropdown;
