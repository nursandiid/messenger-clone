import moment from "moment";
import { Fragment } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/contexts/app-context";

export default function ChatMessages() {
  const { auth } = useAppContext();
  const { messages, paginate, user } = useChatMessageContext();

  const sortedAndFilteredMessages = messages
    .sort((a, b) => a.sort_id - b.sort_id)
    .filter((message, index) => {
      if (message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0) {
        return false;
      }

      return true;
    })
    .filter((message) => message.body || message.attachments.length > 0);

  return (
    <div className="relative flex flex-1 flex-col gap-[3px] overflow-x-hidden">
      {sortedAndFilteredMessages.map((message, index) => {
        const isFirstMessage = index === 0;
        const date = moment(message.created_at);
        const prevDate = sortedAndFilteredMessages[index - 1]?.created_at;
        const isDifferentDate = !date.isSame(prevDate, "date");

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMMM YYYY")}
              </p>
            )}

            {message.from_id === user.id && message.from_id !== auth.id ? (
              <div className="flex flex-row justify-start">
                <div className="group relative flex items-center gap-2">
                  <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-secondary py-2 pl-2 pr-4 text-sm lg:max-w-md">
                    <p
                      dangerouslySetInnerHTML={{ __html: message.body }}
                      className="my-auto overflow-auto"
                    />
                    <span className="-mt-4 ml-auto text-xs">
                      {date.format("H:mm")}
                    </span>
                  </div>

                  <DeleteMessage />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="group relative flex flex-row-reverse items-center gap-2">
                  <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-primary py-2 pl-4 pr-2 text-sm text-white lg:max-w-md">
                    <p
                      dangerouslySetInnerHTML={{ __html: message.body }}
                      className="my-auto overflow-auto"
                    />
                    <span className="-mt-4 ml-auto text-xs">
                      {date.format("H:mm")}
                    </span>
                  </div>

                  <DeleteMessage />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
