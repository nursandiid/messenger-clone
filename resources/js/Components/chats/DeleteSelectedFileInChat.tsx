import { deleteFileInChat } from "@/api/chat-messages";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { Attachment, ChatMessage } from "@/types/chat-message";
import { existingFiles, existingMedia } from "@/utils";
import { BsX } from "react-icons/bs";

type DeleteSelectedFileInChatProps = {
  message: ChatMessage;
  attachment: Attachment;
};

export default function DeleteSelectedFileInChat({
  message,
  attachment,
}: DeleteSelectedFileInChatProps) {
  const { messages, setMessages, reloadMedia, reloadFiles, user } =
    useChatMessageContext();

  const deleteSelectedFile = () => {
    deleteFileInChat(message, attachment).then(() => {
      const updatedAttachments = message.attachments.filter(
        (a) => a.file_name !== attachment.file_name,
      );

      setMessages(
        messages.map((m) => {
          if (m.id === message.id) {
            m.attachments = updatedAttachments;
          }

          return m;
        }),
      );

      existingMedia(message.attachments) && reloadMedia(user);
      existingFiles(message.attachments) && reloadFiles(user);
    });
  };

  return (
    <button
      className="absolute right-1 top-1 z-10 hidden h-4 w-4 items-center justify-center rounded-full bg-danger text-white group-hover/attachment:flex"
      onClick={deleteSelectedFile}
    >
      <BsX />
    </button>
  );
}
