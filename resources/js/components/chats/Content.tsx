import clsx from "clsx";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatBody from "@/components/chats/ChatBody";
import ChatFooter from "@/components/chats/ChatFooter";
import { useEffect, useRef, useState } from "react";
import DragFileOverlay from "@/components/chats/DragFileOverlay";
import PreviewOnDropFile from "@/components/chats/PreviewOnDropFile";
import { useChatMessageContext } from "@/contexts/chat-message-context";
import { useAppContext } from "@/contexts/app-context";
import { ChatProfile } from "@/types/chat-message";
import { Chat } from "@/types/chat";

export type Preview = File & {
  preview: string;
};

export default function Content() {
  const { auth } = useAppContext();
  const { showSidebarRight, messages, user, isTyping, setIsTyping } =
    useChatMessageContext();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [onDrag, setOnDrag] = useState(false);
  const [onDrop, setOnDrop] = useState(false);
  const [attachments, setAttachments] = useState<Preview[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<Preview>();

  useEffect(() => {
    window.Echo.private(
      `user-typing-${user.id}-to-${auth.id}`,
    ).listenForWhisper(
      ".typing",
      (data: { from: ChatProfile; to: ChatProfile; oldMessage: Chat }) => {
        if (data.to.id === auth.id && data.from.id === user.id) {
          setIsTyping(true);
          setTimeout(scrollToBottom, 300);
        }
      },
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    isTyping && setTimeout(() => setIsTyping(false), 10000);
  }, [isTyping]);

  const scrollToBottom = () => {
    if (bottomRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = bottomRef.current.offsetTop;
    }
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length === 0) {
      return setOnDrag(false);
    }

    onSelectOrPreviewFiles(files);
  };

  const onSelectOrPreviewFiles = (files: FileList | null) => {
    if (!files) return;

    const droppedFiles = Array.from(files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setAttachments([...attachments, ...droppedFiles]);
    setSelectedPreview(droppedFiles[0]);

    setOnDrag(false);
    setOnDrop(true);
  };

  const closeOnPreview = () => {
    setOnDrop(false);
    setAttachments([]);
  };

  return (
    <div
      className={clsx(
        "relative order-3 h-full w-full flex-1 flex-col justify-between overflow-x-hidden border-secondary sm:border-l",
        showSidebarRight ? "hidden lg:flex" : "flex",
      )}
      tabIndex={0}
      onDragEnter={() => setOnDrag(true)}
      onDragExit={() => setOnDrag(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleOnDrop}
    >
      <ChatHeader onDrop={onDrop} closeOnPreview={closeOnPreview} />
      <ChatBody
        chatContainerRef={chatContainerRef}
        bottomRef={bottomRef}
        scrollToBottom={scrollToBottom}
        onDrop={onDrop}
      />

      <PreviewOnDropFile
        onDrop={onDrop}
        closeOnPreview={closeOnPreview}
        selectedPreview={selectedPreview as Preview}
        setSelectedPreview={setSelectedPreview}
        attachments={attachments}
        setAttachments={setAttachments}
      />

      <DragFileOverlay onDrag={onDrag} onDrop={onDrop} />

      <ChatFooter
        scrollToBottom={scrollToBottom}
        attachments={attachments}
        closeOnPreview={closeOnPreview}
        onSelectOrPreviewFiles={onSelectOrPreviewFiles}
      />
    </div>
  );
}
