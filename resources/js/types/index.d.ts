import { Config } from "ziggy-js";
import { User } from "@/types/user";
import { ChatPaginate } from "./chat";
import {
  Attachment,
  ChatMessagePaginate,
  ChatProfile,
  Link,
} from "./chat-message";
import { ContactPaginate } from "./contact";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: User;
  ziggy: Config & { location: string };
  error_msg: string | null;
  success_msg: string | null;
  notification_count: number;
};

export type ChatPageProps = PageProps<{ chats: ChatPaginate }>;

export type ChatMessagePageProps = PageProps<{
  chats: ChatPaginate;
  user: ChatProfile;
  messages: ChatMessagePaginate;
  media: Attachment[];
  files: Attachment[];
  links: Link[];
}>;

export type ContactPageProps = PageProps<{ contacts: ContactPaginate }>;
