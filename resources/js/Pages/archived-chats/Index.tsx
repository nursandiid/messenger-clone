import { ChatProvider } from "@/contexts/chat-context";
import { ModalProvider } from "@/contexts/modal-context";

import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/archived-chats/Sidebar";
import ContentEmpty from "@/components/chats/ContentEmpty";

export default function Chats() {
  return (
    <AppLayout title="Archived Chats">
      <ChatProvider>
        <ModalProvider>
          <SidebarMini />
          <Sidebar />
          <ContentEmpty />
        </ModalProvider>
      </ChatProvider>
    </AppLayout>
  );
}
