import { useAppContext } from "@/contexts/app-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import moment from "moment";
import ChatMessages from "@/components/chats/ChatMessages";
import SaveOrBlockContact from "@/components/chats/SaveOrBlockContact";
import { useInView } from "react-intersection-observer";
import { BsArrowClockwise } from "react-icons/bs";
import { useEffect } from "react";
import { fetchMessagesInPaginate } from "@/api/chat-messages";

type ChatBodyProps = {
  chatContainerRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  scrollToBottom: () => void;
  onDrop: boolean;
};

export default function ChatBody({
  chatContainerRef,
  bottomRef,
  scrollToBottom,
  onDrop,
}: ChatBodyProps) {
  const { auth } = useAppContext();
  const { user, messages, setMessages, paginate, setPaginate, isTyping } =
    useChatMessageContext();

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    const inViewObserver = setTimeout(() => {
      if (inView && loadMoreRef.length > 0) {
        if (paginate.next_page_url) {
          fetchMessagesInPaginate(paginate.next_page_url).then((response) => {
            if (chatContainerRef.current) {
              const {
                scrollHeight: prevScrollHeight,
                scrollTop: prevScrollTop,
              } = chatContainerRef.current;

              setPaginate(response.data.data);
              setMessages([...messages, ...response.data.data.data]);

              setTimeout(() => {
                if (chatContainerRef.current) {
                  const { scrollHeight } = chatContainerRef.current;
                  const newScrollHeight = scrollHeight - prevScrollHeight;

                  chatContainerRef.current.scrollTop =
                    newScrollHeight + prevScrollTop;
                }
              }, 100);
            }
          });
        }
      }
    }, 500);

    return () => {
      clearTimeout(inViewObserver);
    };
  }, [inView, paginate]);

  return (
    !onDrop && (
      <div
        className="relative max-h-[100vh_-_120px] flex-1 overflow-auto p-2 pt-8"
        ref={chatContainerRef}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="picture">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-12 w-12 rounded-full border border-secondary"
            />
          </div>
          <div>
            <h5 className="mt-1 text-lg font-medium">{user.name}</h5>
            {user.chat_type === CHAT_TYPE.GROUP_CHATS ? (
              <p className="text-sm text-secondary-foreground">
                {auth.id === user.creator_id ? "You " : `${user.creator.name} `}
                created group "{user.name}" <br />
                on {moment(user.created_at).format("DD/MM/YY ")}
                at {moment(user.created_at).format("H:mm")}
              </p>
            ) : (
              <p className="text-sm text-secondary-foreground">
                Join <br /> on {moment(user.created_at).format("DD/MM/YY ")}
                at {moment(user.created_at).format("H:mm")}
              </p>
            )}
          </div>
        </div>

        {paginate.next_page_url && (
          <button className="mx-auto mt-4 flex" ref={loadMoreRef}>
            <BsArrowClockwise className="animate-spin text-2xl text-secondary-foreground" />
          </button>
        )}

        <ChatMessages />

        {user.chat_type === CHAT_TYPE.CHATS &&
          user.id !== auth.id &&
          isTyping && (
            <div className="my-[3px] flex flex-row justify-start">
              <div className="typing relative flex gap-1 rounded-3xl bg-secondary px-4 py-3">
                <div className="animate-typing h-2 w-2 rounded-full bg-secondary-foreground/50" />
                <div className="animate-typing h-2 w-2 rounded-full bg-secondary-foreground/50" />
                <div className="animate-typing h-2 w-2 rounded-full bg-secondary-foreground/50" />
              </div>
            </div>
          )}

        <div ref={bottomRef} className="h-0" />

        <SaveOrBlockContact />
      </div>
    )
  );
}
