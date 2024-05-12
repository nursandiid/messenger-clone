import { ChatProvider } from "@/contexts/chat-context";
import { ChatMessageProvider } from "@/contexts/chat-message-context";
import { ModalProvider } from "@/contexts/modal-context";

import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/chats/Sidebar";
import Content from "@/components/chats/Content";
import SidebarRight from "@/components/chats/SidebarRight";
import PopupGallery from "@/components/chats/PopupGallery";

export default function Chats() {
  return (
    <AppLayout title="Chats">
      <ChatProvider>
        <ChatMessageProvider>
          <ModalProvider>
            <SidebarMini />
            <Sidebar />
            <Content />
            <SidebarRight />

            <PopupGallery />
          </ModalProvider>
        </ChatMessageProvider>
      </ChatProvider>
    </AppLayout>
  );
}
