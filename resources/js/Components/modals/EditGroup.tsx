import Modal from "@/components/modals/Modal";
import { useModalContext } from "@/contexts/modal-context";
import { GroupSchema } from "@/types/group";
import { router, useForm } from "@inertiajs/react";
import {
  ChangeEvent,
  FormEventHandler,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsCamera } from "react-icons/bs";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import InputError from "@/components/InputError";
import TextArea from "@/components/TextArea";
import ComboBox, { People } from "@/components/ComboBox";
import { fetchMembers } from "@/api/groups";
import { ChatProfile } from "@/types/chat-message";
import { useAppContext } from "@/contexts/app-context";
import { ChatMessagePageProps } from "@/types";

export default function EditGroup() {
  const { auth } = useAppContext();
  const { closeModal, data: user } = useModalContext<ChatProfile>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialSelected, setInitialSelected] = useState<People>([]);

  const avatarRef = useRef<HTMLImageElement>(null);

  const { data, setData, post, errors, processing } = useForm<GroupSchema>({
    _method: "PATCH",
    name: user?.name!,
    description: user?.description!,
    avatar: null,
    group_members: [],
  });

  useEffect(() => {
    fetchMembers(user!).then((response) => {
      const initialMembers = response.data.data.map((member) => {
        return { id: member.id, name: member.name };
      });
      setInitialSelected(initialMembers);
      setIsLoaded(true);
      setData(
        "group_members",
        initialMembers.map((member) => member.id),
      );
    });
  }, []);

  const isCreator = auth.id === user?.creator_id!;

  const handleOnSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (processing || !isCreator) return;

    post(route("group.update", user?.id!), {
      onSuccess: (response) => {
        const props = response.props as unknown as ChatMessagePageProps;

        router.get(route("chats.show", props.user.id));
        closeModal();
      },
    });
  };

  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setData("avatar", files[0]);

      const imageUrl = window.URL.createObjectURL(files[0]);
      avatarRef.current?.setAttribute("src", imageUrl);

      return () => {
        window.URL.revokeObjectURL(imageUrl);
      };
    }
  };

  const addMembers = (value: string[]) => {
    setData("group_members", value);
  };

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4">
      <Modal>
        <Modal.Header title="Group Detail" onClose={closeModal} />
        <Modal.Body as={Fragment}>
          {isLoaded ? (
            <>
              <div className="picture relative">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="mx-auto h-20 w-20 rounded-full border border-secondary"
                  ref={avatarRef}
                />

                {isCreator && (
                  <label
                    htmlFor="avatar"
                    className="btn btn-primary absolute left-1/2 top-6 flex translate-x-5 cursor-pointer items-center justify-center rounded-full px-2"
                    tabIndex={0}
                  >
                    <BsCamera />
                    <input
                      type="file"
                      onChange={changeAvatar}
                      id="avatar"
                      className="hidden"
                    />
                  </label>
                )}

                <InputError
                  className="mt-2 text-center"
                  message={errors.avatar}
                />
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="name" value="Subject" />

                <TextInput
                  id="name"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  disabled={!isCreator}
                />

                <InputError className="mt-2" message={errors.name} />
              </div>

              <div className="space-y-2">
                <InputLabel htmlFor="description" value="Description" />

                <TextArea
                  id="description"
                  className="mt-1 block w-full"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  disabled={!isCreator}
                />

                <InputError className="mt-2" message={errors.description} />
              </div>

              <div className="relative space-y-2">
                <InputLabel htmlFor="group_members" value="Add members" />

                <ComboBox
                  url={route("users.index")}
                  onChange={addMembers}
                  initialSelected={initialSelected}
                  refId="group_members"
                  disabled={!isCreator}
                />

                <InputError className="mt-2" message={errors.group_members} />
              </div>
            </>
          ) : (
            <p className="p-4">Loading...</p>
          )}
        </Modal.Body>

        {isCreator && (
          <Modal.Footer className="flex justify-between gap-4">
            <button className="btn btn-secondary flex-1" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-primary flex-1" disabled={processing}>
              Save
            </button>
          </Modal.Footer>
        )}
      </Modal>
    </form>
  );
}
