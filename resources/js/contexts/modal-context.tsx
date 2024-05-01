import Modal from "@/components/Modal";
import AddNewGroup from "@/components/modals/AddNewGroup";
import BlockContactConfirmation from "@/components/modals/BlockContactConfirmation";
import CustomizeChat from "@/components/modals/CustomizeChat";
import DeleteChatConfirmation from "@/components/modals/DeleteChatConfirmation";
import DeleteContactConfirmation from "@/components/modals/DeleteContactConfirmation";
import DeleteMessageConfirmation from "@/components/modals/DeleteMessageConfirmation";
import EditGroup from "@/components/modals/EditGroup";
import ExitGroupConfirmation from "@/components/modals/ExitGroupConfirmation";
import Preferences from "@/components/modals/Preferences";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useReducer,
} from "react";

type ModalViews =
  | "PREFERENCES"
  | "DELETE_MESSAGE_CONFIRMATION"
  | "DELETE_CHAT_CONFIRMATION"
  | "BLOCK_CONTACT_CONFIRMATION"
  | "CUSTOMIZE_CHAT"
  | "ADD_NEW_GROUP"
  | "EDIT_GROUP"
  | "EXIT_GROUP_CONFIRMATION"
  | "DELETE_CONTACT_CONFIRMATION";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl";

type OpenModal<T = any> = {
  view: ModalViews;
  size?: ModalSize;
  payload?: T;
};

type State<T = any> = {
  view?: ModalViews;
  size?: ModalSize;
  data?: T;
  isOpen: boolean;
  openModal: <T>({ view, size, payload }: OpenModal<T>) => void;
  closeModal: () => void;
  dispatchOnCanceled?: () => void;
};

type Action<T = any> =
  | ({
      type: "OPEN";
    } & OpenModal<T>)
  | {
      type: "CLOSE";
    };

const initialState: State = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        view: action.view,
        size: action.size,
        data: action.payload,
        isOpen: true,
        dispatchOnCanceled:
          action.payload &&
          action.payload.dispatchOnCanceled &&
          action.payload.dispatchOnCanceled,
      };

    case "CLOSE":
      return {
        ...state,
        view: undefined,
        size: undefined,
        data: undefined,
        isOpen: false,
        dispatchOnCanceled: undefined,
      };
  }
};

const ModalContext = createContext(initialState);

export function useModalContext<T = any>() {
  return useContext<State<T>>(ModalContext);
}

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const openModal = ({ view, size, payload }: OpenModal) =>
    dispatch({ type: "OPEN", view, size, payload });

  const closeModal = () => dispatch({ type: "CLOSE" });

  const value = {
    ...state,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalChildren />
    </ModalContext.Provider>
  );
};

export const ModalChildren = () => {
  const { isOpen, view, size, closeModal, dispatchOnCanceled } =
    useModalContext();

  const handleOnClose = () => {
    if (dispatchOnCanceled && typeof dispatchOnCanceled === "function") {
      dispatchOnCanceled();
    }

    closeModal();
  };

  return (
    <Modal show={isOpen} onClose={handleOnClose} maxWidth={size}>
      {view === "PREFERENCES" && <Preferences />}
      {view === "DELETE_MESSAGE_CONFIRMATION" && <DeleteMessageConfirmation />}
      {view === "DELETE_CHAT_CONFIRMATION" && <DeleteChatConfirmation />}
      {view === "BLOCK_CONTACT_CONFIRMATION" && <BlockContactConfirmation />}
      {view === "CUSTOMIZE_CHAT" && <CustomizeChat />}
      {view === "ADD_NEW_GROUP" && <AddNewGroup />}
      {view === "EDIT_GROUP" && <EditGroup />}
      {view === "EXIT_GROUP_CONFIRMATION" && <ExitGroupConfirmation />}
      {view === "DELETE_CONTACT_CONFIRMATION" && <DeleteContactConfirmation />}
    </Modal>
  );
};
