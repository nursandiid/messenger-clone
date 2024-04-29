import { useChatMessageContext } from "@/contexts/chat-message-context";
import clsx from "clsx";
import ProfileInformation from "@/components/chats/ProfileInformation";
import Attachments from "@/components/chats/Attachments";
import { useState } from "react";

export default function SidebarRight() {
  const { showSidebarRight } = useChatMessageContext();
  const [toggleCustomizeChat, setToggleCustomizeChat] = useState(false);
  const [toggleShowMedia, setToggleShowMedia] = useState(false);

  return (
    <div
      className={clsx(
        "relative order-4 h-full overflow-x-hidden border-secondary sm:flex-1 sm:border-l lg:w-[320px] lg:flex-initial xl:w-[360px]",
        showSidebarRight ? "flex" : "hidden",
      )}
    >
      <ProfileInformation
        toggleCustomizeChat={toggleCustomizeChat}
        toggleShowMedia={toggleShowMedia}
        setToggleCustomizeChat={setToggleCustomizeChat}
        setToggleShowMedia={setToggleShowMedia}
      />

      <Attachments
        toggleShowMedia={toggleShowMedia}
        setToggleShowMedia={setToggleShowMedia}
      />
    </div>
  );
}
