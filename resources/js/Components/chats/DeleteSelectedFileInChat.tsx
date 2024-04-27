import { Attachment, ChatMessage } from "@/types/chat-message";
import { BsX } from "react-icons/bs";

type DeleteSelectedFileInChatProps = {
  message: ChatMessage;
  attachment: Attachment;
};

export default function DeleteSelectedFileInChat({
  message,
  attachment,
}: DeleteSelectedFileInChatProps) {
  const deleteSelectedFile = () => {
    // TODO: delete selected file / image
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
