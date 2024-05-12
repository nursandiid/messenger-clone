import { ContactProvider } from "@/contexts/contact-context";
import { ModalProvider } from "@/contexts/modal-context";

import AppLayout from "@/layouts/AppLayout";
import SidebarMini from "@/layouts/partials/SidebarMini";
import Sidebar from "@/components/contacts/Sidebar";
import ContentEmpty from "@/components/chats/ContentEmpty";

export default function Contacts() {
  return (
    <AppLayout title="People">
      <ContactProvider>
        <ModalProvider>
          <SidebarMini />
          <Sidebar />
          <ContentEmpty />
        </ModalProvider>
      </ContactProvider>
    </AppLayout>
  );
}
