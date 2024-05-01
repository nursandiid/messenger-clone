import { deleteContact } from "@/api/contacts";
import Modal from "@/components/modals/Modal";
import { useContactContext } from "@/contexts/contact-context";
import { useModalContext } from "@/contexts/modal-context";
import { User } from "@/types/user";
import { Fragment } from "react";

export default function DeleteContactConfirmation() {
  const { closeModal, data: contact } = useModalContext<User>();
  const { contacts, setContacts } = useContactContext();

  if (!contact) return;

  const handleDeleteContact = () => {
    deleteContact(contact.id).then(() => {
      closeModal();
      setContacts([...contacts.filter((c) => c.id !== contact.id)]);
    });
  };

  return (
    <Modal>
      <Modal.Header title="Delete Contact?" onClose={closeModal} />
      <Modal.Body as={Fragment}>
        <p>
          This contact will be removed for you. It will not appear in your
          contact list.
        </p>
      </Modal.Body>

      <Modal.Footer className="flex justify-between gap-4">
        <button className="btn btn-secondary flex-1" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger flex-1" onClick={handleDeleteContact}>
          Delete contact
        </button>
      </Modal.Footer>
    </Modal>
  );
}
