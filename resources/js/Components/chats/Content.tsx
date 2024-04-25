import clsx from "clsx";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatBody from "@/components/chats/ChatBody";
import ChatFooter from "@/components/chats/ChatFooter";

export default function Content() {
  return (
    <div
      className={clsx(
        "relative order-3 flex h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary sm:border-l",
      )}
    >
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </div>
  );
}
