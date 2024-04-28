import { Chat, ChatPaginate } from "@/types/chat";
import { AxiosResponse } from "axios";

export const fetchChats = (
  query?: string,
): Promise<AxiosResponse<{ data: ChatPaginate }>> => {
  return window.axios.get(`${route("chats.users")}?query=${query || ""}`);
};

export const markAsRead = (
  chat: Chat,
): Promise<AxiosResponse<{ data: Chat }>> => {
  return window.axios.post(route("chats.mark_as_read", chat.id));
};
