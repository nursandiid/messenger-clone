import { Link } from "@inertiajs/react";
import BadgeOnline from "@/components/chats/BadgeOnline";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { useContactContext } from "@/contexts/contact-context";
import { fetchContactsInPaginate } from "@/api/contacts";
import ContactListAction from "@/components/contacts/ContactListAction";

export default function ContactList() {
  const { contacts, setContacts, paginate, setPaginate } = useContactContext();
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && loadMoreRef.length > 0) {
      if (paginate.next_page_url) {
        fetchContactsInPaginate(paginate.next_page_url).then((response) => {
          setPaginate(response.data.data);
          setContacts([...contacts, ...response.data.data.data]);
        });
      }
    }
  }, [inView, paginate]);

  if (contacts.length === 0) return;

  return (
    <div className="relative max-h-[calc(100vh_-_158px)] flex-1 overflow-y-auto px-2 sm:max-h-max sm:pb-2">
      {contacts
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) =>
          a.is_online === b.is_online ? 0 : a.is_online ? -1 : 1,
        )
        .map((contact) => (
          <div className="group relative flex items-center" key={contact.id}>
            <Link
              href={route("chats.show", contact.id)}
              as="button"
              className={clsx(
                "relative flex w-full flex-1 items-center gap-3 rounded-lg p-3 text-left transition-all group-hover:bg-secondary",
                contact.is_contact_blocked && "opacity-25",
              )}
            >
              <div className="relative shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="h-10 w-10 rounded-full border border-secondary"
                />
                {contact.is_online && <BadgeOnline />}
              </div>

              <div className="overflow-hidden">
                <h5 className="truncate font-medium">{contact.name}</h5>
              </div>
            </Link>

            <ContactListAction contact={contact} />
          </div>
        ))}

      {paginate.next_page_url && (
        <button className="mx-auto mt-4 flex" ref={loadMoreRef}>
          <BsArrowClockwise className="animate-spin text-2xl text-secondary-foreground" />
        </button>
      )}
    </div>
  );
}
