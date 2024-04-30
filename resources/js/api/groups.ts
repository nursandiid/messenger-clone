import { ChatProfile } from "@/types/chat-message";
import { GroupMember } from "@/types/group";
import { AxiosResponse } from "axios";

export const fetchMembers = (
  user: ChatProfile,
): Promise<AxiosResponse<{ data: GroupMember[] }>> => {
  return window.axios.get(route("group.members", user.id));
};
