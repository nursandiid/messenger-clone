import { fetchChats } from "@/api/chats";
import { fetchContacts } from "@/api/contacts";
import { ChatPageProps, ContactPageProps } from "@/types";
import { Chat, ChatPaginate } from "@/types/chat";
import { ChatProfile } from "@/types/chat-message";
import { ContactPaginate } from "@/types/contact";
import { InitialPaginate } from "@/types/paginate";
import { User } from "@/types/user";
import { usePage } from "@inertiajs/react";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useReducer,
  useEffect,
  useState,
} from "react";

type State = {
  contacts: User[];
  paginate: ContactPaginate;
  setContacts: (value: User[]) => void;
  setPaginate: (value: ContactPaginate) => void;
};

type Action =
  | {
      type: "SET_CONTACTS";
      payload: User[];
    }
  | {
      type: "SET_PAGINATE";
      payload: ContactPaginate;
    };

const initialState: State = {
  contacts: [],
  paginate: InitialPaginate,
  setContacts: () => {},
  setPaginate: () => {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload,
      };

    case "SET_PAGINATE":
      return {
        ...state,
        paginate: action.payload,
      };
  }
};

const ContactContext = createContext(initialState);

export const useContactContext = () => useContext(ContactContext);

export const ContactProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<ContactPageProps>().props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const setContacts = (value: User[]) =>
    dispatch({ type: "SET_CONTACTS", payload: value });

  const setPaginate = (value: ContactPaginate) =>
    dispatch({ type: "SET_PAGINATE", payload: value });

  useEffect(() => {
    setIsFirstLoading(false);
    setContacts(props.contacts.data);
    setPaginate(props.contacts);

    window.Echo.channel(`user-activity`).listen(
      ".user-activity",
      (data: { user: ChatProfile }) => {
        const contacts =
          state.contacts.length > 0 ? state.contacts : props.contacts.data;

        setContacts(
          contacts.map((contact) => {
            if (contact.id === data.user.id) {
              contact.is_online = data.user.is_online;
            }

            return contact;
          }),
        );
      },
    );
  }, []);

  const value = {
    ...state,
    contacts: isFirstLoading ? props.contacts.data : state.contacts,
    paginate: isFirstLoading ? props.contacts : state.paginate,
    setContacts,
    setPaginate,
  };

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
};
