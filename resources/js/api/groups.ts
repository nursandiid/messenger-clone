import { Chat } from "@/types/chat";
import { ChatProfile } from "@/types/chat-message";
import { GroupMember } from "@/types/group";
import { AxiosResponse } from "axios";

export const fetchMembers = (
  user: ChatProfile,
): Promise<AxiosResponse<{ data: GroupMember[] }>> => {
  return window.axios.get(route("group.members", user.id));
};

export const exitGroup = (
  chat: Chat,
): Promise<AxiosResponse<{ data: null }>> => {
  return window.axios.delete(route("group.exit", chat.id));
};
