import { exitGroup } from "@/api/groups";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useModalContext } from "@/contexts/modal-context";
import { Chat } from "@/types/chat";
import { Fragment } from "react";

export default function ExitGroupConfirmation() {
  const { closeModal, data: chat } = useModalContext<Chat>();
  const { chats, setChats } = useChatContext();

  const handleExitContact = () => {
    exitGroup(chat!).then(() => {
      setChats(chats.filter((c) => c.id !== chat?.id));
      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header
        title={`Exit "${chat?.name}" group?`}
        onClose={closeModal}
      />
      <Modal.Body as={Fragment}>
        <p>
          This group will be removed for you. You can not see anything in this
          group.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger flex-1" onClick={handleExitContact}>
          Exit group
        </button>
      </Modal.Footer>
    </Modal>
  );
}
