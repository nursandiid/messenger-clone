import { ChatPaginate } from "@/types/chat";
import { AxiosResponse } from "axios";

export const fetchChats = (
  query?: string,
): Promise<AxiosResponse<{ data: ChatPaginate }>> => {
  return window.axios.get(`${route("chats.users")}?query=${query || ""}`);
};
