import { deleteChat } from "@/api/chats";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { router } from "@inertiajs/react";
import { Fragment } from "react";

export default function DeleteChatConfirmation() {
  const { closeModal, data: chat } = useModalContext<Chat>();
  const { chats, setChats } = useChatContext();

  if (!chat) return;

  const handleDeleteChat = () => {
    deleteChat(chat).then(() => {
      if (
        route().current("chats.index") ||
        route().current("archived_chats.index")
      ) {
        closeModal();
        setChats([...chats.filter((c) => c.id !== chat.id)]);

        return;
      }

      route().current("chats.*")
        ? router.replace(route("chats.index"))
        : router.replace(route("archived_chats.index"));
    });
  };

  return (
    <Modal>
      <Modal.Header title="Delete Chat?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          This chat will be removed for you, including the files. Others in the
          chat will still be able to see it.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteChat}>
          Delete for me
        </button>
      </Modal.Footer>
    </Modal>
  );
}
