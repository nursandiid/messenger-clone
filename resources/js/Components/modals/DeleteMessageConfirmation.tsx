import { deleteMessage } from "@/api/chat-messages";
import Modal from "@/components/modals/Modal";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useModalContext } from "@/contexts/modal-context";
import { ChatMessage } from "@/types/chat-message";
import { existingFiles, existingLinks, existingMedia } from "@/utils";
import { Fragment } from "react";

export default function DeleteMessageConfirmation() {
  const { closeModal, data: message } = useModalContext<ChatMessage>();
  const { refetchChats } = useChatContext();
  const { messages, setMessages, user, reloadMedia, reloadFiles, reloadLinks } =
    useChatMessageContext();

  if (!message) return;

  const handleDeleteMessage = () => {
    deleteMessage(message).then(() => {
      refetchChats();
      setMessages([...messages.filter((m) => m.id !== message.id)]);

      existingMedia(message.attachments) && reloadMedia(user);
      existingFiles(message.attachments) && reloadFiles(user);
      existingLinks(message.links) && reloadLinks(user);

      closeModal();
    });
  };

  return (
    <Modal>
      <Modal.Header title="Delete Message?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          This message will be removed for you. Others in the chat will still be
          able to see it.
        </p>

        {message.attachments?.length > 0 && (
          <p>{message.attachments.length} files will be removed for you.</p>
        )}
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteMessage}>
          Delete for me
        </button>
      </Modal.Footer>
    </Modal>
  );
}
