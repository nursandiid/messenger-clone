import { Fragment } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useModalContext } from "@/contexts/modal-context";
import { BsAppIndicator, BsChevronDown, BsCircleHalf } from "react-icons/bs";

import Modal from "@/components/modals/Modal";
import Dropdown from "@/components/Dropdown";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { updateUser } from "@/api/users";

export default function Preferences() {
  const { theme, auth, setTheme, setAuth } = useAppContext();
  const { closeModal } = useModalContext();

  const toggleActiveStatus = (status: boolean) => {
    updateUser(auth, { active_status: status }).then(() => {
      setAuth({ ...auth, active_status: status });
    });
  };

  return (
    <Modal>
      <Modal.Header title="Preferences" onClose={closeModal} />

      <Modal.Body className="flex" as={Fragment}>
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsCircleHalf />
            Theme
          </div>
          <Dropdown>
            <Dropdown.Trigger>
              <button className="btn btn-secondary flex items-center gap-2">
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                <BsChevronDown />
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Button onClick={() => setTheme("system")}>
                System
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("dark")}>
                Dark
              </Dropdown.Button>
              <Dropdown.Button onClick={() => setTheme("light")}>
                Light
              </Dropdown.Button>
            </Dropdown.Content>
          </Dropdown>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <BsAppIndicator />
            Active Status
          </div>

          <Switch
            checked={auth.active_status}
            onChange={toggleActiveStatus}
            className={clsx(
              "relative inline-flex h-6 w-11 items-center rounded-full",
              auth.active_status ? "bg-primary" : "bg-secondary",
            )}
          >
            <span className="sr-only">Enable active status</span>
            <span
              className={`${
                auth.active_status ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </Modal.Body>
    </Modal>
  );
}
