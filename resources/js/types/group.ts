import { Method } from "./method";

export type GroupSchema = {
  _method: Method;
  name: string;
  description: string;
  avatar: File | null;
  group_members: string[];
};

export type GroupMember = {
  id: string;
  name: string;
  group_id: string;
};
