import Modal from "@/components/Modal";
import Preferences from "@/components/modals/Preferences";
import {
  createContext,
  useContext,
  PropsWithChildren,
  useReducer,
} from "react";

type ModalViews = "PREFERENCES";

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
      };

    case "CLOSE":
      return {
        ...state,
        view: undefined,
        size: undefined,
        data: undefined,
        isOpen: false,
      };
  }
};

const ModalContext = createContext(initialState);

export const useModalContext = () => useContext(ModalContext);

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
  const { isOpen, view, size, closeModal } = useModalContext();

  return (
    <Modal show={isOpen} onClose={closeModal} maxWidth={size}>
      {view === "PREFERENCES" && <Preferences />}
    </Modal>
  );
};
