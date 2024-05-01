import BadgeOnline from "@/components/chats/BadgeOnline";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import moment from "moment";
import { BsThreeDots, BsXLg } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";

type ChatHeaderProps = {
  onDrop: boolean;
  closeOnPreview: () => void;
};

export default function ChatHeader({
  onDrop,
  closeOnPreview,
}: ChatHeaderProps) {
  const { user, toggleSidebarRight, showSidebarRight } =
    useChatMessageContext();

  return (
    <div className="flex h-14 items-center justify-between border-b border-secondary p-2 shadow-sm">
      <div className="flex items-center gap-2">
        <Link
          href={route("chats.index")}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary focus:bg-secondary sm:hidden"
        >
          <FaArrowLeft />
        </Link>

        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 rounded-full border border-secondary"
          />
          {user.is_online && <BadgeOnline className="!right-0" />}
        </div>

        <div className="leading-4">
          <h5 className="font-medium">{user.name}</h5>
          {user.chat_type === CHAT_TYPE.CHATS && (
            <span className="text-xs text-secondary-foreground">
              {user.is_online
                ? "Online"
                : moment(user.last_seen).isAfter("2000-01-01")
                  ? moment(user.last_seen).format("DD/MM/YY H:mm")
                  : "Last seen a long time ago"}
            </span>
          )}
        </div>
      </div>

      {onDrop ? (
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary focus:bg-secondary"
          onClick={closeOnPreview}
        >
          <BsXLg />
        </button>
      ) : (
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary focus:bg-secondary"
          onClick={toggleSidebarRight}
        >
          {showSidebarRight ? (
            <div
              className={clsx(
                "rounded-full p-0.5 text-sm text-white",
                !user.message_color && "bg-primary",
              )}
              style={{ background: user.message_color }}
            >
              <BsThreeDots />
            </div>
          ) : (
            <BsThreeDots />
          )}
        </button>
      )}
    </div>
  );
}
