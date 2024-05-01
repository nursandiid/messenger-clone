import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useChatContext } from "@/contexts/chat-context";
import clsx from "clsx";
import ContactListSearch from "@/components/contacts/ContactListSearch";
import ContactList from "@/components/contacts/ContactList";
import { useContactContext } from "@/contexts/contact-context";

export default function Sidebar() {
  const { contacts } = useContactContext();

  const [search, setSearch] = useState("");

  return (
    <div
      className={clsx(
        "order-1 flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]",
        route().current("chats.show") ? "hidden" : "flex",
      )}
    >
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">People</h3>
        <p>
          Active contacts (
          {contacts.filter((contact) => contact.is_online === true).length})
        </p>
      </div>

      {/* searching */}
      <ContactListSearch search={search} setSearch={setSearch} />

      {/* contact list */}
      <ContactList />

      {contacts.length === 0 && search.length > 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          Contact not found
        </p>
      )}

      {contacts.length === 0 && search.length === 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          No contact saved yet
        </p>
      )}
    </div>
  );
}
