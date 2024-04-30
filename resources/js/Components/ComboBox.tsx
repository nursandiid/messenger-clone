import { useDebounce } from "@/hooks/use-debounce";
import { Combobox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { BsCheck, BsChevronExpand, BsX } from "react-icons/bs";

export type Person = { id: string; name: string };
export type People = Person[];

type ComboBoxProps = {
  url: string;
  onChange: (value: string[]) => void;
  initialSelected: People;
  refId?: string;
  disabled?: boolean;
};

export default function ComboBox({
  url,
  onChange: updateData,
  initialSelected,
  refId,
  disabled,
}: ComboBoxProps) {
  const [people, setPeople] = useState<People>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [selectedPerson, setSelectedPerson] = useState(initialSelected);

  useEffect(() => {
    if (query.length === 0) {
      return setPeople([]);
    }

    window.axios
      .get(`${url}?query=${query}`)
      .then((response: { data: { data: People } }) => {
        setPeople(
          response.data.data.filter(
            (person) =>
              selectedPerson.find((selected) => selected.id === person.id) ===
              undefined,
          ),
        );
      });
  }, [debouncedQuery]);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleOnChange = (value: People) => {
    updateData(value.map((val) => val.id));
    setSelectedPerson(value);
  };

  const removeSelectedPerson = (person: Person) => {
    const filteredPerson = selectedPerson.filter(
      (selected) => selected.id !== person.id,
    );

    setSelectedPerson(filteredPerson);
    updateData(filteredPerson.map((val) => val.id));
  };

  return (
    <Combobox value={selectedPerson} onChange={handleOnChange} multiple>
      <div
        className="form-control combobox relative h-full w-full cursor-default overflow-hidden"
        aria-disabled={disabled}
        tabIndex={-1}
      >
        {selectedPerson.length > 0 && (
          <ul className="m-2 flex flex-wrap gap-1 text-xs">
            {selectedPerson.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-2 rounded-full bg-primary px-2 py-1 text-white"
              >
                <span>{person.name}</span>
                {!disabled && (
                  <button
                    className="flex h-3 w-3 items-center rounded-full bg-white text-sm text-black"
                    type="button"
                    onClick={() => removeSelectedPerson(person)}
                    tabIndex={-1}
                  >
                    <BsX />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: Person) => person.name}
          className={clsx(
            "w-full border-none py-2 pl-3 pr-10 leading-5 text-foreground outline-none focus:ring-0",
            disabled ? "bg-transparent" : "bg-background",
          )}
          id={refId}
          tabIndex={0}
          aria-disabled={disabled}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <BsChevronExpand className="h-5 w-5 text-gray-400" />
        </Combobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options
          className={clsx(
            "absolute mt-1 max-h-60 w-full overflow-auto rounded-md border-gray-200 bg-background text-base shadow-lg focus:outline-none dark:border-gray-500/25 sm:text-sm",
            (query.length > 0 || filteredPeople.length > 0) && "border",
          )}
        >
          {filteredPeople.length === 0 && query.length > 0 ? (
            <div className="relative cursor-default select-none px-4 py-2 text-foreground">
              Nothing found.
            </div>
          ) : (
            filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none px-4 py-2",
                    active ? "bg-secondary" : "text-foreground",
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(
                        "block truncate",
                        selected ? "font-medium" : "font-normal",
                      )}
                    >
                      {person.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-foreground">
                        <BsCheck className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
