import clsx from "clsx";
import { Fragment, PropsWithChildren } from "react";
import { BsX } from "react-icons/bs";

const Modal = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={clsx("flex flex-col gap-4 p-4 text-foreground", className)}>
      {children}
    </div>
  );
};

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => {
  return (
    <div className="flex items-center">
      <h2 className="text-lg font-medium">{title}</h2>
      <button className="btn btn-secondary btn-close ml-auto" onClick={onClose}>
        <BsX />
      </button>
    </div>
  );
};

const Body = ({
  className,
  as: Component = "div",
  children,
}: PropsWithChildren<{ as?: React.ElementType; className?: string }>) => {
  return Component === Fragment ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Component className={className}>{children}</Component>
  );
};

const Footer = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={className}>{children}</div>;
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
