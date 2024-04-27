import clsx from "clsx";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatBody from "@/components/chats/ChatBody";
import ChatFooter from "@/components/chats/ChatFooter";
import { useEffect, useRef } from "react";

export default function Content() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (bottomRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = bottomRef.current.offsetTop;
    }
  };

  return (
    <div
      className={clsx(
        "relative order-3 flex h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary sm:border-l",
      )}
    >
      <ChatHeader />
      <ChatBody
        chatContainerRef={chatContainerRef}
        bottomRef={bottomRef}
        scrollToBottom={scrollToBottom}
      />
      <ChatFooter scrollToBottom={scrollToBottom} />
    </div>
  );
}
