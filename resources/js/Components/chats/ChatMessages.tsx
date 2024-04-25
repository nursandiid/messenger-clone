import moment from "moment";
import { Fragment } from "react";
import DeleteMessage from "@/components/chats/DeleteMessage";

export default function ChatMessages() {
  return (
    <div className="relative flex flex-1 flex-col gap-[3px] overflow-x-hidden">
      <Fragment>
        <p className="p-4 text-center text-xs text-secondary-foreground sm:text-sm">
          {moment().format("DD MMMM YYYY")}
        </p>

        {/* left */}
        <div className="flex flex-row justify-start">
          <div className="group relative flex items-center gap-2">
            <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-secondary py-2 pl-2 pr-4 text-sm lg:max-w-md">
              <p
                dangerouslySetInnerHTML={{ __html: "Lorem ipsum." }}
                className="my-auto overflow-auto"
              />
              <span className="-mt-4 ml-auto text-xs">
                {moment().format("H:mm")}
              </span>
            </div>

            <DeleteMessage />
          </div>
        </div>

        {/* right */}
        <div className="flex flex-row justify-end">
          <div className="group relative flex flex-row-reverse items-center gap-2">
            <div className="relative flex max-w-xs flex-wrap items-end gap-2 rounded-2xl bg-primary py-2 pl-4 pr-2 text-sm text-white lg:max-w-md">
              <p
                dangerouslySetInnerHTML={{ __html: "Lorem ipsum." }}
                className="my-auto overflow-auto"
              />
              <span className="-mt-4 ml-auto text-xs">
                {moment().format("H:mm")}
              </span>
            </div>

            <DeleteMessage />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
