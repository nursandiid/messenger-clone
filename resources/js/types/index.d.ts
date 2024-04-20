import { Config } from "ziggy-js";
import { User } from "@/types/user";
import { ChatPaginate } from "./chat";

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: User;
  ziggy: Config & { location: string };
};

export type ChatPageProps = PageProps<{ chats: ChatPaginate }>;
