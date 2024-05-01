import {
  fetchFiles,
  fetchLinks,
  fetchMedia,
  fetchMessages,
} from "@/api/chat-messages";
import { ChatMessagePageProps } from "@/types";
import { CHAT_TYPE } from "@/types/chat";
import {
  Attachment,
  ChatMessage,
  ChatMessagePaginate,
  ChatProfile,
  Link,
} from "@/types/chat-message";
import { InitialPaginate } from "@/types/paginate";
import { existingFiles, existingLinks, existingMedia } from "@/utils";
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
  user: ChatProfile;
  messages: ChatMessage[];
  paginate: ChatMessagePaginate;
  media: Attachment[];
  selectedMedia?: Attachment;
  files: Attachment[];
  links: Link[];
  showSidebarRight: boolean;
  isTyping: boolean;
  setUser: (value: ChatProfile) => void;
  setMessages: (value: ChatMessage[]) => void;
  setPaginate: (value: ChatMessagePaginate) => void;
  setMedia: (value: Attachment[]) => void;
  setSelectedMedia: (value: Attachment) => void;
  clearSelectedMedia: () => void;
  setFiles: (value: Attachment[]) => void;
  setLinks: (value: Link[]) => void;
  reloadMedia: (user: ChatProfile) => void;
  reloadFiles: (user: ChatProfile) => void;
  reloadLinks: (user: ChatProfile) => void;
  toggleSidebarRight: () => void;
  setIsTyping: (value: boolean) => void;
};

type Action =
  | {
      type: "SET_USER";
      payload: ChatProfile;
    }
  | {
      type: "TOGGLE_SIDEBAR_RIGHT";
    }
  | {
      type: "SET_MESSAGES";
      payload: ChatMessage[];
    }
  | {
      type: "SET_PAGINATE";
      payload: ChatMessagePaginate;
    }
  | {
      type: "SET_MEDIA";
      payload: Attachment[];
    }
  | {
      type: "SET_SELECTED_MEDIA";
      payload?: Attachment;
    }
  | {
      type: "SET_FILES";
      payload: Attachment[];
    }
  | {
      type: "SET_LINKS";
      payload: Link[];
    }
  | {
      type: "SET_IS_TYPING";
      payload: boolean;
    };

const initialState: State = {
  user: {
    id: "",
    name: "",
    email: "",
    email_verified_at: "",
    avatar: "",
    active_status: false,
    is_online: false,
    last_seen: "",
    chat_type: CHAT_TYPE.CHATS,
    message_color: "",
    is_contact_saved: false,
    is_contact_blocked: false,
    description: "",
    creator_id: "",
    creator: {
      id: "",
      name: "",
    },
    members_count: 0,
  },
  messages: [],
  paginate: InitialPaginate,
  media: [],
  selectedMedia: undefined,
  files: [],
  links: [],
  showSidebarRight: false,
  isTyping: false,
  setUser: () => {},
  setMessages: () => {},
  setPaginate: () => {},
  setMedia: () => {},
  setSelectedMedia: () => {},
  clearSelectedMedia: () => {},
  setFiles: () => {},
  setLinks: () => {},
  reloadMedia: () => {},
  reloadFiles: () => {},
  reloadLinks: () => {},
  toggleSidebarRight: () => {},
  setIsTyping: () => {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "TOGGLE_SIDEBAR_RIGHT":
      const value = localStorage.getItem("toggle-sidebar-right") === "true";

      localStorage.setItem("toggle-sidebar-right", String(!value));

      return {
        ...state,
        showSidebarRight: !value,
      };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    case "SET_PAGINATE":
      return {
        ...state,
        paginate: action.payload,
      };

    case "SET_MEDIA":
      return {
        ...state,
        media: action.payload,
      };

    case "SET_SELECTED_MEDIA":
      return {
        ...state,
        selectedMedia: action.payload,
      };

    case "SET_FILES":
      return {
        ...state,
        files: action.payload,
      };

    case "SET_LINKS":
      return {
        ...state,
        links: action.payload,
      };

    case "SET_IS_TYPING":
      return {
        ...state,
        isTyping: action.payload,
      };
  }
};

const ChatMessageContext = createContext(initialState);

export const useChatMessageContext = () => useContext(ChatMessageContext);

export const ChatMessageProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<ChatMessagePageProps>().props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const setUser = (value: ChatProfile) =>
    dispatch({ type: "SET_USER", payload: value });

  const setMessages = (value: ChatMessage[]) =>
    dispatch({ type: "SET_MESSAGES", payload: value });

  const setPaginate = (value: ChatMessagePaginate) =>
    dispatch({ type: "SET_PAGINATE", payload: value });

  const setMedia = (value: Attachment[]) =>
    dispatch({ type: "SET_MEDIA", payload: value });

  const setSelectedMedia = (value: Attachment) =>
    dispatch({ type: "SET_SELECTED_MEDIA", payload: value });

  const clearSelectedMedia = () =>
    dispatch({ type: "SET_SELECTED_MEDIA", payload: undefined });

  const setFiles = (value: Attachment[]) =>
    dispatch({ type: "SET_FILES", payload: value });

  const setLinks = (value: Link[]) =>
    dispatch({ type: "SET_LINKS", payload: value });

  const reloadMedia = (user: ChatProfile) => {
    fetchMedia(user).then((response) => setMedia(response.data.data));
  };

  const reloadFiles = (user: ChatProfile) => {
    fetchFiles(user).then((response) => setFiles(response.data.data));
  };

  const reloadLinks = (user: ChatProfile) => {
    fetchLinks(user).then((response) => setLinks(response.data.data));
  };

  const toggleSidebarRight = () => dispatch({ type: "TOGGLE_SIDEBAR_RIGHT" });

  const setIsTyping = (value: boolean) =>
    dispatch({ type: "SET_IS_TYPING", payload: value });

  const refetchMessages = () => {
    fetchMessages(props.user).then((response) => {
      setPaginate(response.data.data);
      setMessages(response.data.data.data);
    });
  };

  const syncAll = (data: { chat: ChatMessage }) => {
    refetchMessages();

    existingMedia(data.chat.attachments) && reloadMedia(props.user);
    existingFiles(data.chat.attachments) && reloadFiles(props.user);
    existingLinks(data.chat.links) && reloadLinks(props.user);
  };

  useEffect(() => {
    setIsFirstLoading(false);
    setUser(props.user);
    setMessages(props.messages.data);
    setPaginate(props.messages);
    setMedia(props.media);
    setFiles(props.files);
    setLinks(props.links);

    window.Echo.channel(`user-activity`).listen(
      ".user-activity",
      (data: { user: ChatProfile }) => {
        const user = state.user.id ? state.user : props.user;
        user.id === data.user.id &&
          setUser({ ...user, is_online: data.user.is_online });
      },
    );

    window.Echo.channel(
      `send-message-${props.user.id}-to-${props.auth.id}`,
    ).listen(".send-message", syncAll);

    window.Echo.channel(`send-group-message-${props.user.id}`).listen(
      ".send-group-message",
      syncAll,
    );
  }, []);

  const value = {
    ...state,
    user: isFirstLoading ? props.user : state.user,
    messages: isFirstLoading ? props.messages.data : state.messages,
    paginate: isFirstLoading ? props.messages : state.paginate,
    media: isFirstLoading ? props.media : state.media,
    files: isFirstLoading ? props.files : state.files,
    links: isFirstLoading ? props.links : state.links,
    showSidebarRight: localStorage.getItem("toggle-sidebar-right") === "true",
    setUser,
    setMessages,
    setPaginate,
    setMedia,
    setSelectedMedia,
    clearSelectedMedia,
    setFiles,
    setLinks,
    reloadMedia,
    reloadFiles,
    reloadLinks,
    toggleSidebarRight,
    setIsTyping,
  };

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};
