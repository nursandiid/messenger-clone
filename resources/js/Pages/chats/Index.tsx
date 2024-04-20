import ContentEmpty from "@/components/chats/ContentEmpty";
import Sidebar from "@/components/chats/Sidebar";
import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";

export default function Chats() {
  return (
    <AppLayout title="Chats">
      <SidebarMini />
      <Sidebar />
      <ContentEmpty />
    </AppLayout>
  );
}
