import moment from "moment";
import { Fragment } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { CHAT_TYPE } from "@/types/chat";
import { useAppContext } from "@/contexts/app-context";
import { formatFileSize, isImageLinkValid } from "@/utils";
import { Attachment } from "@/types/chat-message";
import { BsFileEarmarkText } from "react-icons/bs";
import clsx from "clsx";
import DeleteSelectedFileInChat from "@/components/chats/DeleteSelectedFileInChat";

export default function ChatMessages() {
  const { auth } = useAppContext();
  const { messages, paginate, user } = useChatMessageContext();

  const downloadFile = (attachment: Attachment) => {
    window.open(`${attachment.file_path}/${attachment.file_name}`);
  };

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

        const messageWithImages = message.attachments.filter((attachment) =>
          isImageLinkValid(attachment.original_name),
        );
        const messageWithFiles = message.attachments.filter(
          (attachment) => !isImageLinkValid(attachment.original_name),
        );

        return (
          <Fragment key={`message-${message.id}`}>
            {(isFirstMessage || isDifferentDate) && (
              <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
                {date.format("DD MMMM YYYY")}
              </p>
            )}

            {message.from_id === user.id && message.from_id !== auth.id ? (
              <div className="flex flex-row justify-start">
                <div className="text-sm text-white">
                  {message.body && (
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
                  )}

                  {message.body &&
                    message.attachments &&
                    message.attachments.length > 0 && (
                      <div className="my-[3px]"></div>
                    )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="group relative flex gap-1">
                      <div className="flex max-w-xs flex-col">
                        {messageWithImages.length > 0 && (
                          <div
                            className={clsx(
                              "grid",
                              messageWithImages.length >= 3
                                ? "w-[300px] grid-cols-3"
                                : `w-[${messageWithImages.length * 100}px] grid-cols-${messageWithImages.length}`,
                            )}
                          >
                            {messageWithImages.map((attachment) => (
                              <div
                                className="group/attachment relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl p-1 transition-all hover:bg-secondary"
                                key={attachment.file_name}
                              >
                                <img
                                  src={`${attachment.file_path}/${attachment.file_name}`}
                                  alt={attachment.original_name}
                                  className="h-full rounded-lg object-cover"
                                />

                                {message.attachments.length > 1 && (
                                  <DeleteSelectedFileInChat
                                    message={message}
                                    attachment={attachment}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {messageWithFiles.length > 0 && (
                          <div className="ml-auto grid max-w-xs grid-cols-1 gap-1">
                            {messageWithFiles.map((attachment) => (
                              <div
                                className="group/attachment"
                                key={attachment.file_name}
                              >
                                <div
                                  className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl bg-secondary/70 p-2 text-foreground transition-all hover:bg-secondary"
                                  onClick={() => downloadFile(attachment)}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                    <BsFileEarmarkText className="text-xl" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <h5 className="truncate font-medium">
                                      {attachment.original_name}
                                    </h5>
                                    <div className="flex justify-between gap-2 text-xs">
                                      <span>
                                        {formatFileSize(attachment.file_size)}
                                      </span>
                                      <span className="ml-auto text-secondary-foreground">
                                        {moment(message.created_at).format(
                                          "H:mm",
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {message.attachments.length > 1 && (
                                    <DeleteSelectedFileInChat
                                      message={message}
                                      attachment={attachment}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {!message.body && (
                        <DeleteMessage className="my-auto ml-auto mr-2" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-end">
                <div className="text-sm text-white">
                  {message.body && (
                    <div className="group relative flex flex-row-reverse items-center gap-2">
                      <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-primary py-2 pl-4 pr-2 lg:max-w-md">
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
                  )}

                  {message.body &&
                    message.attachments &&
                    message.attachments.length > 0 && (
                      <div className="my-[3px]"></div>
                    )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="group relative flex justify-end gap-1">
                      <div className="order-2 flex max-w-xs flex-col justify-end">
                        {messageWithImages.length > 0 && (
                          <div
                            className={clsx(
                              "ml-auto grid",
                              messageWithImages.length >= 3
                                ? "w-[300px] grid-cols-3"
                                : `w-[${messageWithImages.length * 100}px] grid-cols-${messageWithImages.length}`,
                            )}
                            dir="rtl"
                          >
                            {messageWithImages.map((attachment) => (
                              <div
                                className="group/attachment relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl p-1 transition-all hover:bg-secondary"
                                key={attachment.file_name}
                              >
                                <img
                                  src={`${attachment.file_path}/${attachment.file_name}`}
                                  alt={attachment.original_name}
                                  className="h-full rounded-lg object-cover"
                                />

                                {message.attachments.length > 1 && (
                                  <DeleteSelectedFileInChat
                                    message={message}
                                    attachment={attachment}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {messageWithFiles.length > 0 && (
                          <div className="ml-auto grid max-w-xs grid-cols-1 gap-1">
                            {messageWithFiles.map((attachment) => (
                              <div
                                className="group/attachment"
                                key={attachment.file_name}
                              >
                                <div
                                  className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl bg-secondary/70 p-2 text-foreground transition-all hover:bg-secondary"
                                  onClick={() => downloadFile(attachment)}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                    <BsFileEarmarkText className="text-xl" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <h5 className="truncate font-medium">
                                      {attachment.original_name}
                                    </h5>
                                    <div className="flex justify-between gap-2 text-xs">
                                      <span>
                                        {formatFileSize(attachment.file_size)}
                                      </span>
                                      <span className="ml-auto text-secondary-foreground">
                                        {moment(message.created_at).format(
                                          "H:mm",
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {message.attachments.length > 1 && (
                                    <DeleteSelectedFileInChat
                                      message={message}
                                      attachment={attachment}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {!message.body && (
                        <DeleteMessage className="order-1 my-auto ml-auto mr-2 flex-row-reverse" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
