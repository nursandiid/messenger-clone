import { fetchNotification } from "@/api/chats";
import Alert from "@/components/Alert";
import { PageProps } from "@/types";
import { User } from "@/types/user";
import { replaceBadgeNotificationCount } from "@/utils";
import { usePage } from "@inertiajs/react";
import moment from "moment";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "react";

type State = {
  theme: string;
  auth: User;
  errorMsg?: string | null;
  successMsg?: string | null;
  notificationCount: number;
  setTheme: (value: string) => void;
  setAuth: (value: User) => void;
  setErrorMsg: (value: string | null) => void;
  setSuccessMsg: (value: string | null) => void;
  syncNotification: () => void;
};

type Action =
  | {
      type: "SET_THEME";
      payload: string;
    }
  | {
      type: "SET_AUTH";
      payload: User;
    }
  | {
      type: "SET_ERROR_MSG";
      payload: string | null;
    }
  | {
      type: "SET_SUCCESS_MSG";
      payload: string | null;
    }
  | {
      type: "SET_NOTIFICATION_COUNT";
      payload: number;
    };

const initialState: State = {
  theme: localStorage.getItem("theme") || "system",
  auth: {
    id: "",
    name: "",
    email: "",
    email_verified_at: "",
    avatar: "",
    active_status: false,
    is_online: false,
    last_seen: "",
    is_contact_blocked: false,
    is_contact_saved: false,
  },
  notificationCount: 0,
  setTheme: () => {},
  setAuth: () => {},
  setErrorMsg: () => {},
  setSuccessMsg: () => {},
  syncNotification: () => {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_THEME":
      const theme = action.payload;
      const html = document.documentElement;

      if (html) {
        html.classList.remove("dark");
        html.classList.remove("light");
      }

      switch (theme) {
        case "system":
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? html.classList.add("dark")
            : html.classList.add("light");
          break;
        case "dark":
          html.classList.add("dark");
          break;
        case "light":
          html.classList.add("light");
      }

      localStorage.setItem("theme", theme);

      return {
        ...state,
        theme,
      };

    case "SET_AUTH":
      return {
        ...state,
        auth: action.payload,
      };

    case "SET_ERROR_MSG":
      return {
        ...state,
        errorMsg: action.payload,
      };

    case "SET_SUCCESS_MSG":
      return {
        ...state,
        successMsg: action.payload,
      };

    case "SET_NOTIFICATION_COUNT":
      return {
        ...state,
        notificationCount: action.payload,
      };
  }
};

const AppContext = createContext(initialState);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const props = usePage<PageProps>().props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const notificationRef = useRef<HTMLAudioElement>(null);

  const setTheme = (value: string) =>
    dispatch({ type: "SET_THEME", payload: value });

  const setAuth = (value: User) =>
    dispatch({ type: "SET_AUTH", payload: value });

  const setErrorMsg = (value: string | null) =>
    dispatch({ type: "SET_ERROR_MSG", payload: value });

  const setSuccessMsg = (value: string | null) =>
    dispatch({ type: "SET_SUCCESS_MSG", payload: value });

  const setNotificationCount = (value: number) =>
    dispatch({ type: "SET_NOTIFICATION_COUNT", payload: value });

  const syncNotification = async () => {
    const lastSync = localStorage.getItem("last-sync-notification");
    const currentTime = moment();

    if (lastSync && currentTime.diff(moment(parseInt(lastSync))) < 3000) return;

    localStorage.setItem(
      "last-sync-notification",
      currentTime.valueOf().toString(),
    );

    return await fetchNotification().then((response) => {
      setNotificationCount(response.data.data.notification_count);
    });
  };

  useEffect(() => {
    setAuth(props.auth);
    setNotificationCount(props.notification_count);
    setIsFirstLoading(false);

    if (props.error_msg) setErrorMsg(props.error_msg);
    if (props.success_msg) setSuccessMsg(props.success_msg);

    window.Echo.channel(`send-message-${props.auth.id}`).listen(
      ".send-message",
      () => {
        syncNotification().then(() => {
          notificationRef.current?.play();
        });
      },
    );
  }, []);

  useEffect(() => {
    if (state.errorMsg) setTimeout(() => setErrorMsg(null), 5000);
    if (state.successMsg) setTimeout(() => setSuccessMsg(null), 5000);
  }, [state.errorMsg, state.successMsg]);

  useEffect(() => {
    !isFirstLoading && replaceBadgeNotificationCount(state.notificationCount);
  }, [state.notificationCount]);

  const value = {
    ...state,
    theme: localStorage.getItem("theme") || "system",
    auth: isFirstLoading ? props.auth : state.auth,
    notificationCount: isFirstLoading
      ? props.notification_count
      : state.notificationCount,
    setTheme,
    setAuth,
    setErrorMsg,
    setSuccessMsg,
    syncNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}

      {state.errorMsg && (
        <Alert message={state.errorMsg} className="bg-danger text-white" />
      )}
      {state.successMsg && (
        <Alert message={state.successMsg} className="bg-success text-white" />
      )}

      <audio controls className="hidden" ref={notificationRef}>
        <source src="/audios/notification.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </AppContext.Provider>
  );
};
