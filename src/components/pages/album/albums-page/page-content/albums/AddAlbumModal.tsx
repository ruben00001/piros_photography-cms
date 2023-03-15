import { Dialog } from "@headlessui/react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { create, useStore } from "zustand";

import Toast from "~/components/data-display/Toast";
import TextInput from "~/components/forms/TextInput";
import { PlusIcon } from "~/components/Icon";
import MyModalPanel from "~/components/MyModalPanel";
import { api } from "~/utils/api";

// TODO: create status

type ModalVisibilityState = {
  isOpen: boolean;
  openModal: (arg0?: { onOpen: () => void }) => void;
  closeModal: () => void;
};

const addAlbumModalVisibilityStore = create<ModalVisibilityState>((set) => ({
  isOpen: false,

  openModal: () => {
    set(() => ({ isOpen: true }));
  },

  closeModal: () => {
    set(() => ({ isOpen: false }));
  },
}));

export const AddAlbumPanel = () => {
  const { isOpen, closeModal } = useStore(addAlbumModalVisibilityStore);

  return (
    <MyModalPanel isOpen={isOpen} onClose={closeModal}>
      <Panel />
    </MyModalPanel>
  );
};

export const AddAlbumModalButton = () => {
  const { openModal } = useStore(addAlbumModalVisibilityStore);

  return (
    <button
      className="my-btn-action group flex items-center gap-xs rounded-md py-1.5 px-sm text-white"
      onClick={() => openModal()}
      type="button"
    >
      <span className="text-sm">
        <PlusIcon weight="bold" />
      </span>
      <span className="text-sm font-medium">New album</span>
    </button>
  );
};

const Panel = () => {
  return (
    <div className="min-w-[300px] max-w-xl rounded-2xl bg-white p-6 shadow-lg">
      <Dialog.Title
        as="h3"
        className="border-b border-b-base-300 pb-sm leading-6 text-base-content"
      >
        Add album
      </Dialog.Title>
      <div className="mt-md">
        <TitleInput />
      </div>
    </div>
  );
};

const TitleInput = () => {
  const [inputText, setInputText] = useState("");

  const { closeModal } = useStore(addAlbumModalVisibilityStore);

  const {
    refetch: checkTitleIsUnique,
    data: titleIsUnique,
    isFetching: isFetchingCheckTitleIsUnique,
  } = api.album.checkTitleIsUnique.useQuery(
    { title: inputText },
    { enabled: false }
  );

  const { refetch: refetchAlbums } = api.album.albumsPageGetAll.useQuery();

  const createAlbum = api.album.create.useMutation({
    onSuccess: () => {
      toast(<Toast text="Album created" type="success" />);

      closeModal();

      void refetchAlbums();
    },
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: titleIsUnique } = await checkTitleIsUnique();

    if (!titleIsUnique) {
      return;
    }

    createAlbum.mutate({ title: inputText });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit}>
      <div className="form-control w-full max-w-xs">
        <TextInput
          setValue={setInputText}
          value={inputText}
          placeholder="Album title..."
          showPressEnter
          showBorderOnBlur
        />
        <label className="label">
          {titleIsUnique === false ? (
            <span className="label-text-alt text-error">
              Title is already used. Album titles must be unique.
            </span>
          ) : null}
        </label>
        {isFetchingCheckTitleIsUnique ? (
          <div className="absolute left-0 top-0 z-10 grid h-full w-full place-items-center bg-gray-100 bg-opacity-70">
            <p className="loading">Checking...</p>
          </div>
        ) : null}
      </div>
    </form>
  );
};
