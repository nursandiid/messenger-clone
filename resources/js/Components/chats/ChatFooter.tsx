import clsx from "clsx";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmile, BsPlusLg } from "react-icons/bs";

export default function ChatFooter() {
  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(48);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const onSelectFile = () => {};

  const handleOnKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const onPressBackspace = e.key === "Backspace";
    const onPressEnter = e.key === "Enter";

    if (onPressEnter && !e.shiftKey) {
      e.preventDefault();
      // TODO: submit form
    }

    if (onPressBackspace) {
      const target = e.target as HTMLTextAreaElement;
      const lines = target.validationMessage.split("\n");

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

  return (
    <form className="flex items-end gap-2 bg-background p-2 text-foreground">
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
        <button type="button" className="absolute right-2 mb-3 text-primary">
          <BsEmojiSmile className="h-6 w-6" />
        </button>
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
          message.trim().length > 0 && "bg-primary !text-white",
        )}
      >
        <BiSend className="h-6 w-6" />
      </button>
    </form>
  );
}
