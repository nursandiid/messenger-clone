import ChatList from "@/components/chats/ChatList";
import { useChatContext } from "@/contexts/chat-context";
import clsx from "clsx";

export default function Sidebar() {
  const { chats } = useChatContext();
  return (
    <div
      className={clsx(
        "order-1 flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]",
        route().current("archived_chats.show") ? "hidden" : "flex",
      )}
    >
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">Archived Chats</h3>
      </div>

      {/* chats recently */}
      <ChatList search="" href="archived_chats.show" />

      {chats.length === 0 && (
        <p className="flex h-full flex-1 items-center justify-center">
          No archived chat yet
        </p>
      )}
    </div>
  );
}
