import { useChatMessageContext } from "@/contexts/chat-message-context";
import { Tab, Transition } from "@headlessui/react";
import clsx from "clsx";
import { FaArrowLeft } from "react-icons/fa";
import { Fragment } from "react";
import { BsFileEarmarkText, BsLink45Deg } from "react-icons/bs";
import { formatFileSize } from "@/utils";
import { Attachment } from "@/types/chat-message";

type AttachmentsProps = {
  toggleShowMedia: boolean;
  setToggleShowMedia: (value: boolean) => void;
};

export default function Attachments({
  toggleShowMedia,
  setToggleShowMedia,
}: AttachmentsProps) {
  const { showSidebarRight, media, setSelectedMedia, files, links } =
    useChatMessageContext();

  const downloadFile = (url: string) => {
    window.open(url);
  };

  const openPopupGallery = (image: Attachment) => {
    setSelectedMedia(image);
  };

  return (
    <Transition
      show={toggleShowMedia}
      enter="transition-transform duration-300 ease-out"
      enterFrom="transform opacity-0 -translate-x-[-100%]"
      enterTo="transform opacity-100 translate-x-0"
      leave="transition-transform duration-300 ease-out"
      leaveFrom="transform opacity-100 translate-x-0"
      leaveTo="transform opacity-0 -translate-x-[-100%]"
      className={clsx(
        "absolute top-0 w-full flex-col lg:flex",
        showSidebarRight ? "flex" : "hidden",
      )}
    >
      <div className="sticky top-0 flex h-14 items-center gap-2 border-b border-secondary bg-background px-2 lg:shadow-sm">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary focus:bg-secondary"
          onClick={() => setToggleShowMedia(!toggleShowMedia)}
        >
          <FaArrowLeft />
        </button>
        <h5 className="font-medium">Media, files and links</h5>
      </div>

      <Tab.Group>
        <Tab.List className="mx-2 mb-2 mt-4 flex rounded-full border border-secondary">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={clsx(
                  "w-full rounded-full py-2 text-sm hover:bg-secondary focus:bg-secondary",
                  selected && "bg-secondary",
                )}
              >
                Media
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={clsx(
                  "w-full rounded-full py-2 text-sm hover:bg-secondary focus:bg-secondary",
                  selected && "bg-secondary",
                )}
              >
                Files
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={clsx(
                  "w-full rounded-full py-2 text-sm hover:bg-secondary focus:bg-secondary",
                  selected && "bg-secondary",
                )}
              >
                Links
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className="h-[calc(100vh_-_120px)]">
          <Tab.Panel className="flex h-full flex-col">
            {media.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 overflow-auto p-2">
                {media
                  .sort((a, b) => b.created_at.localeCompare(a.created_at))
                  .map((image) => (
                    <div
                      key={image.file_name}
                      className="flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary"
                      onClick={() => openPopupGallery(image)}
                    >
                      <img
                        src={`${image.file_path}/${image.file_name}`}
                        alt={image.original_name}
                        className="h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="my-auto text-center">No media</div>
            )}
          </Tab.Panel>
          <Tab.Panel className="flex h-full flex-col">
            {files.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 overflow-auto p-2">
                {files
                  .sort((a, b) => b.created_at.localeCompare(a.created_at))
                  .map((file) => (
                    <div
                      className="flex cursor-pointer items-center gap-2"
                      key={file.file_name}
                      onClick={() =>
                        downloadFile(`${file.file_path}/${file.file_name}`)
                      }
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <BsFileEarmarkText className="text-xl" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="truncate font-medium">
                          {file.original_name}
                        </h5>
                        <span className="text-xs">
                          {formatFileSize(file.file_size)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="my-auto text-center">No files</div>
            )}
          </Tab.Panel>
          <Tab.Panel className="flex h-full flex-col">
            {links.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 overflow-auto p-2">
                {links.map((link, index) => (
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    key={`link-` + index}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <BsLink45Deg className="text-2xl" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="truncate font-medium">{link}</h5>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="my-auto text-center">No links</div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Transition>
  );
}
