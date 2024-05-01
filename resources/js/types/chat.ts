import { Paginate } from "./paginate";
import { Contact } from "./user";

export type Chat = {
  id: string;
  name: string;
  avatar: string;
  message_id: string;
  from_id: string;
  body: string;
  is_read: boolean;
  is_reply: boolean;
  is_online: boolean;
  created_at: string;
  chat_type: CHAT_TYPE;
} & Contact;

export enum CHAT_TYPE {
  CHATS = "chats",
  GROUP_CHATS = "group_chats",
}

export type ChatPaginate = Paginate<Chat[]>;
