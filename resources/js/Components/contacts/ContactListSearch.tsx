import { fetchContacts } from "@/api/contacts";
import { useContactContext } from "@/contexts/contact-context";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

type ContactListSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ContactListSearch({
  search,
  setSearch,
}: ContactListSearchProps) {
  const { setContacts, setPaginate } = useContactContext();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    setIsFirstLoading(false);

    if (!isFirstLoading) {
      fetchContacts(debouncedSearch).then((response) => {
        setContacts(response.data.data.data);
        setPaginate(response.data.data);
      });
    }
  }, [debouncedSearch]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center px-2 py-0">
      <span className="absolute left-5">
        <BiSearch className="text-2xl text-secondary-foreground" />
      </span>
      <input
        type="text"
        placeholder="Search Messenger"
        className="w-full rounded-lg border-secondary bg-background pl-10 focus:border-secondary focus:ring-transparent"
        value={search}
        onChange={handleOnChange}
      />
    </div>
  );
}
