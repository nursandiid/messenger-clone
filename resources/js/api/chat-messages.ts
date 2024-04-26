import { ChatMessage, ChatProfile } from "@/types/chat-message";
import { AxiosResponse } from "axios";

export const saveMessage = ({
  user,
  message,
}: {
  user: ChatProfile;
  message: string;
}): Promise<AxiosResponse<{ data: ChatMessage }>> => {
  return window.axios.post(
    route("chats.store"),
    {
      to_id: user.id,
      body: message,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
