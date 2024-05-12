import { saveContact } from "@/api/contacts";
import { useAppContext } from "@/contexts/app-context";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useModalContext } from "@/contexts/modal-context";
import { CHAT_TYPE } from "@/types/chat";
import { BsBan, BsCheckCircle } from "react-icons/bs";

export default function SaveOrBlockContact() {
  const { auth } = useAppContext();
  const { chats, setChats } = useChatContext();
  const { user, setUser, messages } = useChatMessageContext();
  const { openModal } = useModalContext();

  const blockContactConfirmation = () => {
    openModal({
      view: "BLOCK_CONTACT_CONFIRMATION",
      size: "lg",
      payload: user,
    });
  };

  const handleSaveContact = () => {
    saveContact(user.id).then(() => {
      setUser({
        ...user,
        is_contact_saved: true,
      });

      setChats(
        chats.map((c) => {
          if (c.id === user.id) {
            c.is_contact_saved = true;
          }

          return c;
        }),
      );
    });
  };

  return (
    user.chat_type === CHAT_TYPE.CHATS &&
    messages.length > 0 &&
    !user.is_contact_saved &&
    !user.is_contact_blocked &&
    auth.id !== user.id && (
      <div className="my-2 flex flex-col items-center justify-between gap-2">
        <p className="text-center">
          This contact not saved, would you like to save it?
        </p>

        <div className="flex gap-2">
          <button
            className="btn btn-danger flex items-center gap-2 rounded-full"
            onClick={blockContactConfirmation}
          >
            <BsBan /> Block
          </button>
          <button
            className="btn btn-success flex items-center gap-2 rounded-full"
            onClick={handleSaveContact}
          >
            <BsCheckCircle /> OK
          </button>
        </div>
      </div>
    )
  );
}
