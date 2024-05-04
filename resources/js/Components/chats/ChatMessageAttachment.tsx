import { Attachment, ChatMessage } from "@/types/chat-message";
import clsx from "clsx";
import DeleteSelectedFileInChat from "@/components/chats/DeleteSelectedFileInChat";
import { formatFileSize } from "@/utils";
import { BsFileEarmarkText } from "react-icons/bs";
import moment from "moment";
import DeleteMessage from "@/components/chats/DeleteMessage";
import { useChatMessageContext } from "@/contexts/chat-message-context";

type ChatMessageAttachmentProps = {
  message: ChatMessage;
  messageWithImages: Attachment[];
  messageWithFiles: Attachment[];
  dir: "ltr" | "rtl";
  className?: string;
  gridClassName?: string;
  deleteMessageClassName?: string;
};

export default function ChatMessageAttachment({
  message,
  messageWithImages,
  messageWithFiles,
  dir = "ltr",
  className,
  gridClassName,
  deleteMessageClassName,
}: ChatMessageAttachmentProps) {
  const { setSelectedMedia } = useChatMessageContext();

  const downloadFile = (attachment: Attachment) => {
    window.open(`${attachment.file_path}/${attachment.file_name}`);
  };

  return (
    message.attachments?.length > 0 && (
      <div className="group relative flex gap-1">
        <div className={clsx("flex max-w-xs flex-col", className)}>
          {messageWithImages.length > 0 && (
            <div
              className={clsx(
                "grid",
                gridClassName,
                messageWithImages.length >= 3
                  ? "w-[300px] grid-cols-3"
                  : `w-[${messageWithImages.length * 100}px] grid-cols-${messageWithImages.length}`,
              )}
              dir={dir}
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
                    onClick={() => setSelectedMedia(attachment)}
                  />

                  {message.attachments?.length > 1 && (
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
                <div className="group/attachment" key={attachment.file_name}>
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
                        <span>{formatFileSize(attachment.file_size)}</span>
                        <span className="ml-auto text-secondary-foreground">
                          {moment(message.created_at).format("H:mm")}
                        </span>
                      </div>
                    </div>

                    {message.attachments?.length > 1 && (
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
          <DeleteMessage
            message={message}
            className={clsx("my-auto ml-auto mr-2", deleteMessageClassName)}
          />
        )}
      </div>
    )
  );
}
