import { Chat, CHAT_TYPE } from "@/types/chat";
import Dropdown, { useDropdownContext } from "@/components/Dropdown";
import { useRef } from "react";
import clsx from "clsx";
import {
  BsArchive,
  BsBan,
  BsBoxArrowRight,
  BsCheck2,
  BsThreeDots,
  BsXLg,
} from "react-icons/bs";
import { useAppContext } from "@/contexts/app-context";
import { archiveChat, markAsRead, markAsUnread } from "@/api/chats";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { unblockContact } from "@/api/contacts";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { User } from "@/types/user";
import { useContactContext } from "@/contexts/contact-context";

type ActionProps = {
  contact: User;
};

export default function ContactListAction({ contact }: ActionProps) {
  return (
    <div className="absolute right-8 shrink-0">
      <Dropdown>
        <Action contact={contact} />
      </Dropdown>
    </div>
  );
}

const Action = ({ contact }: ActionProps) => {
  const { contacts, setContacts } = useContactContext();
  const { openModal } = useModalContext();
  const { open } = useDropdownContext();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPosition =
    (dropdownRef.current?.getBoundingClientRect().bottom || 0) <
    window.innerHeight - 100;

  const deleteContactConfirmation = () => {
    openModal({
      view: "DELETE_CONTACT_CONFIRMATION",
      size: "lg",
      payload: contact,
    });
  };

  const blockContactConfirmation = () => {
    openModal({
      view: "BLOCK_CONTACT_CONFIRMATION",
      size: "lg",
      payload: contact,
    });
  };

  const handleUnblockContact = () => {
    unblockContact(contact.id).then(() => {
      setContacts(
        contacts.map((c) => {
          if (c.id === contact.id) {
            c.is_contact_blocked = false;
          }

          return c;
        }),
      );
    });
  };

  return (
    <div ref={dropdownRef}>
      <Dropdown.Trigger>
        <button
          type="button"
          className={clsx(
            "rounded-full border border-secondary bg-background p-1.5 shadow-sm group-hover:visible group-hover:flex",
            open ? "visible" : "invisible",
          )}
        >
          <BsThreeDots className="text-secondary-foreground" />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content
        align={dropdownPosition ? "right" : "top-right"}
        contentClasses={dropdownPosition ? "" : "mb-7"}
      >
        <Dropdown.Button onClick={deleteContactConfirmation}>
          <div className="flex items-center gap-2">
            <BsXLg />
            Delete Contact
          </div>
        </Dropdown.Button>

        <Dropdown.Button
          onClick={
            contact.is_contact_blocked
              ? handleUnblockContact
              : blockContactConfirmation
          }
        >
          {contact.is_contact_blocked ? (
            <div className="flex items-center gap-2 text-success">
              <BsBan />
              Unblock Contact
            </div>
          ) : (
            <div className="flex items-center gap-2 text-danger">
              <BsBan />
              Block Contact
            </div>
          )}
        </Dropdown.Button>
      </Dropdown.Content>
    </div>
  );
};
