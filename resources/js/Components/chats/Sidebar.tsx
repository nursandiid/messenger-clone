import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import ChatListSearch from "@/components/chats/ChatListSearch";
import ChatList from "@/components/chats/ChatList";

export default function Sidebar() {
  const [search, setSearch] = useState("");

  return (
    <div className="order-1 flex flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]">
      <div className="flex items-center justify-between px-2 pt-2 sm:pb-0">
        <h3 className="text-2xl font-semibold">Chats</h3>
        <button className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <FaUsers />
        </button>
      </div>

      {/* searching */}
      <ChatListSearch search={search} setSearch={setSearch} />

      {/* chats recently */}
      <ChatList search={search} href="chats.show" type="chats" />

      {/* message (user not found, no chat yet) */}
    </div>
  );
}
