import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useModalContext } from "@/contexts/modal-context";
import { CHAT_TYPE } from "@/types/chat";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  BsChevronDown,
  BsChevronRight,
  BsRecordCircle,
  BsXLg,
} from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";

type ProfileInformationProps = {
  toggleCustomizeChat: boolean;
  toggleShowMedia: boolean;
  setToggleCustomizeChat: (value: boolean) => void;
  setToggleShowMedia: (value: boolean) => void;
};

export default function ProfileInformation({
  toggleCustomizeChat,
  toggleShowMedia,
  setToggleCustomizeChat,
  setToggleShowMedia,
}: ProfileInformationProps) {
  const { user, setUser, showSidebarRight, toggleSidebarRight } =
    useChatMessageContext();
  const { openModal } = useModalContext();

  const customizeChat = () => {
    openModal({
      view: "CUSTOMIZE_CHAT",
      size: "sm",
      payload: {
        dispatchOnCanceled: () => setUser({ ...user }),
      },
    });
  };

  const editGroup = () => {
    openModal({
      view: "EDIT_GROUP",
      size: "lg",
      payload: user,
    });
  };

  return (
    <Transition
      show={!toggleShowMedia}
      enter="transition-transform duration-300 ease-out"
      enterFrom="transform opacity-0 translate-x-[-100%]"
      enterTo="transform opacity-100 translate-x-0"
      leave="transition-transform duration-300 ease-out"
      leaveFrom="transform opacity-100 translate-x-0"
      leaveTo="transform opacity-0 translate-x-[-100%]"
      className={clsx(
        "w-full flex-col gap-4 lg:flex",
        showSidebarRight ? "flex" : "hidden",
      )}
    >
      <div className="visible flex h-14 items-center border-b border-secondary bg-background px-2 lg:invisible">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary focus:bg-secondary"
          onClick={toggleSidebarRight}
        >
          <BsXLg />
        </button>
      </div>

      <div className="mx-auto flex flex-col gap-3 px-2 py-4 text-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="mx-auto h-20 w-20 rounded-full border border-secondary"
        />

        <h5 className="font-medium">{user.name}</h5>

        {user.chat_type === CHAT_TYPE.GROUP_CHATS && (
          <div>
            <div className="text-sm text-secondary-foreground">
              Group . {user.members_count} members
            </div>
            <div className="text-sm text-secondary-foreground">
              {user.description}
            </div>
            <button
              className="btn btn-secondary btn-close rounded-full text-base focus:ring-0"
              onClick={editGroup}
            >
              <FaInfoCircle
                className={clsx(!user.message_color && "!text-primary")}
                style={{ color: user.message_color }}
              />
            </button>
          </div>
        )}
      </div>

      <div className="px-2">
        <button
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary focus:bg-secondary"
          onClick={() => setToggleCustomizeChat(!toggleCustomizeChat)}
        >
          <span>Customize chat</span>
          {toggleCustomizeChat ? <BsChevronDown /> : <BsChevronRight />}
        </button>
        {toggleCustomizeChat && (
          <button
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary focus:bg-secondary"
            onClick={customizeChat}
          >
            <BsRecordCircle
              className={clsx(!user.message_color && "!text-primary")}
              style={{ color: user.message_color! }}
            />
            Change Theme
          </button>
        )}

        <button
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary focus:bg-secondary"
          onClick={() => setToggleShowMedia(!toggleShowMedia)}
        >
          <span>Media, files and links</span>
          <BsChevronRight />
        </button>
      </div>
    </Transition>
  );
}
