import { Attachment, ChatMessage, ChatProfile } from "@/types/chat-message";
import { AxiosResponse } from "axios";

export const saveMessage = ({
  user,
  message,
  attachments,
}: {
  user: ChatProfile;
  message: string;
  attachments: File[];
}): Promise<AxiosResponse<{ data: ChatMessage }>> => {
  return window.axios.post(
    route("chats.store"),
    {
      to_id: user.id,
      body: message,
      attachments,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const deleteMessage = (
  message: ChatMessage,
): Promise<AxiosResponse<{ data: null }>> => {
  return window.axios.delete(route("chats.destroy", message.id));
};

export const deleteFileInChat = (
  message: ChatMessage,
  attachment: Attachment,
): Promise<AxiosResponse<{ data: null }>> => {
  return window.axios.delete(
    route("chats.delete_file", [message.id, attachment.file_name]),
  );
};