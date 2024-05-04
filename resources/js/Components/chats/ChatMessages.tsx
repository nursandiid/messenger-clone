import moment from "moment";
import { Fragment } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/contexts/app-context";
import { isImageLinkValid } from "@/utils";
import ChatMessageAttachment from "@/components/chats/ChatMessageAttachment";
import clsx from "clsx";

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
    .filter((message) => message.body || message.attachments?.length > 0);

  return (
    <div className="relative flex flex-1 flex-col gap-[3px] overflow-x-hidden">
      {sortedAndFilteredMessages.map((message, index) => {
        const isFirstMessage = index === 0;
        const date = moment(message.created_at);
        const prevDate = sortedAndFilteredMessages[index - 1]?.created_at;
        const isDifferentDate = !date.isSame(prevDate, "date");

        const messageWithImages = message.attachments.filter((attachment) =>
          isImageLinkValid(attachment.original_name),
        );
        const messageWithFiles = message.attachments.filter(
          (attachment) => !isImageLinkValid(attachment.original_name),
        );

        const showProfile =
          (message.chat_type === CHAT_TYPE.GROUP_CHATS &&
            messages[index]?.from_id !== message.from_id) ||
          (message.chat_type === CHAT_TYPE.GROUP_CHATS && index === 0);

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMMM YYYY")}
              </p>
            )}

            {(message.from_id === user.id && message.from_id !== auth.id) ||
            (message.chat_type === CHAT_TYPE.GROUP_CHATS &&
              message.from_id !== auth.id) ? (
              <div className="flex flex-row justify-start">
                <div className="text-sm text-foreground">
                  {message.body && (
                    <div className="group relative flex items-center gap-2">
                      <div>
                        {showProfile && (
                          <div className="mb-1 mt-2 flex items-center gap-2">
                            <img
                              src={message.from.avatar}
                              alt={message.from.name}
                              className="h-6 w-6 rounded-full border border-secondary"
                            />
                            <p className="text-sm font-medium">
                              {message.from.name}
                            </p>
                          </div>
                        )}

                        <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-secondary py-2 pl-2 pr-4 text-sm lg:max-w-md">
                          <p
                            dangerouslySetInnerHTML={{ __html: message.body }}
                            className="my-auto overflow-auto"
                          />
                          <span className="-mt-4 ml-auto text-xs text-secondary-foreground">
                            {date.format("H:mm")}
                          </span>
                        </div>
                      </div>

                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="text-sm text-white">
                  {message.body && (
                    <div className="group relative flex flex-row-reverse items-center gap-2">
                      <div
                        className={clsx(
                          "relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl py-2 pl-4 pr-2 lg:max-w-md",
                          !user.message_color && "bg-primary",
                        )}
                        style={{
                          background: user.message_color
                            ? user.message_color
                            : "",
                        }}
                      >
                        <p
                          dangerouslySetInnerHTML={{ __html: message.body }}
                          className="my-auto overflow-auto"
                        />
                        <span className="-mt-4 ml-auto text-xs text-white/80">
                          {date.format("H:mm")}
                        </span>
                      </div>

                      <DeleteMessage message={message} />
                    </div>
                  )}

                  {message.body && message.attachments?.length > 0 && (
                    <div className="my-[3px]"></div>
                  )}

                  <ChatMessageAttachment
                    message={message}
                    messageWithImages={messageWithImages}
                    messageWithFiles={messageWithFiles}
                    dir="rtl"
                    className="order-2 justify-end"
                    gridClassName="ml-auto"
                    deleteMessageClassName="order-1 flex-row-reverse"
                  />
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
