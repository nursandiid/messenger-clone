import { saveMessage } from "@/api/chat-messages";
import { useAppContext } from "@/contexts/app-context";
import { useChatContext } from "@/contexts/chat-context";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import clsx from "clsx";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsBan, BsEmojiSmile, BsPlusLg } from "react-icons/bs";
import { Preview } from "./Content";
import { unblockContact } from "@/api/contacts";
import { existingFiles, existingLinks, existingMedia } from "@/utils";
import { PresenceChannel } from "laravel-echo";

type ChatFooterProps = {
  scrollToBottom: () => void;
  attachments: Preview[];
  closeOnPreview: () => void;
  onSelectOrPreviewFiles: (files: FileList | null) => void;
};

export default function ChatFooter({
  scrollToBottom,
  attachments,
  closeOnPreview,
  onSelectOrPreviewFiles,
}: ChatFooterProps) {
  const { theme, auth } = useAppContext();
  const { chats, setChats, refetchChats } = useChatContext();
  const {
    user,
    setUser,
    messages,
    setMessages,
    reloadMedia,
    reloadFiles,
    reloadLinks,
  } = useChatMessageContext();

  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(48);
  const [processing, setProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const channel = window.Echo.private(
      `user-typing-${auth.id}-to-${user.id}`,
    ) as PresenceChannel;

    if (message.length > 0 && !isTyping) {
      channel.whisper(".typing", {
        from: auth,
        to: user,
        oldMessage: chats.find((c) => c.id === user.id),
      });

      setIsTyping(true);
    }
  }, [message]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setIsTyping(false);
        setTimeout(scrollToBottom, 300);
      }, 10000);
    }
  }, [isTyping]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectOrPreviewFiles(e.target.files);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const onPressBackspace = e.key === "Backspace";
    const onPressEnter = e.key === "Enter";

    if (onPressEnter && !e.shiftKey) {
      e.preventDefault();
      handleOnSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }

    if (onPressBackspace) {
      const target = e.target as HTMLTextAreaElement;
      const lines = target.value.split("\n");

      if (target.offsetHeight > 48) {
        if (lines[lines.length - 1] === "") {
          setTextareaHeight((prev) => prev - 24);
        }
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      const { scrollHeight, clientHeight } = textareaRef.current;
      if (scrollHeight !== clientHeight) {
        setTextareaHeight(scrollHeight + 4);
      }
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((message.length === 0 && attachments.length === 0) || processing) {
      return;
    }

    setProcessing(true);
    saveMessage({ user, message, attachments })
      .then((response) => {
        closeOnPreview();

        setMessage("");
        setTextareaHeight(48);
        setIsOpenEmoji(false);
        textareaRef.current?.focus();

        const data = response.data.data;

        setMessages([...messages, data]);
        refetchChats();

        existingMedia(data.attachments) && reloadMedia(user);
        existingFiles(data.attachments) && reloadFiles(user);
        existingLinks(data.links) && reloadLinks(user);

        setTimeout(scrollToBottom, 300);
      })
      .finally(() => setProcessing(false));
  };

  const toggleEmoji = () => {
    setIsOpenEmoji(!isOpenEmoji);
  };

  const handleOnEmojiClick = (emoji: string) => {
    setMessage((prevMsg) => prevMsg + emoji);
  };

  const handleUnblockContact = () => {
    unblockContact(user.id).then(() => {
      setChats(
        chats.map((c) => {
          if (c.id === user.id) {
            c.is_contact_blocked = false;
          }

          return c;
        }),
      );

      setUser({ ...user, is_contact_blocked: false });
    });
  };

  if (user.is_contact_blocked) {
    return (
      <div className="flex flex-col items-center justify-between gap-2 border-t border-secondary py-2">
        <p className="text-center">Can't send a message to blocked contact</p>
        <button
          className="btn btn-success flex items-center gap-2 rounded-full"
          onClick={handleUnblockContact}
        >
          <BsBan /> Unblock
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex items-end gap-2 bg-background p-2 text-foreground"
      onSubmit={handleOnSubmit}
    >
      <label
        htmlFor="file"
        className="mb-1 cursor-pointer rounded-full p-2 text-primary transition-all hover:bg-secondary focus:bg-secondary"
      >
        <BsPlusLg className="h-6 w-6" />
        <input
          type="file"
          className="hidden"
          id="file"
          multiple
          onChange={onSelectFile}
        />
      </label>

      <div className="relative flex flex-1 items-end">
        <button
          type="button"
          className="absolute right-2 mb-3 text-primary"
          onClick={toggleEmoji}
        >
          <BsEmojiSmile className="h-6 w-6" />
        </button>

        <div
          className={clsx(
            "absolute bottom-14 right-0 z-10",
            isOpenEmoji ? "block" : "hidden",
          )}
        >
          <EmojiPicker
            theme={(theme === "system" ? "auto" : theme) as Theme}
            skinTonesDisabled={true}
            height={400}
            onEmojiClick={({ emoji }) => handleOnEmojiClick(emoji)}
          ></EmojiPicker>
        </div>

        <textarea
          placeholder="Aa"
          className="max-h-[7.5rem] w-full resize-none rounded-xl border border-secondary bg-secondary pr-10 text-foreground focus:border-transparent focus:ring-transparent"
          value={message}
          onKeyDown={handleOnKeyDown}
          onChange={handleOnChange}
          ref={textareaRef}
          style={{
            height: `${textareaHeight}px`,
          }}
        />
      </div>

      <button
        className={clsx(
          "mb-1 flex rounded-full p-2 text-primary transition-all disabled:cursor-not-allowed",
          message.trim().length === 0 &&
            "hover:bg-secondary focus:bg-secondary",
          message.trim().length > 0 && !processing && "bg-primary !text-white",
        )}
        disabled={processing}
      >
        <BiSend className="h-6 w-6" />
      </button>
    </form>
  );
}
