import { create } from "zustand";

type UploadModalStore = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const useUploadModalVisibilityState = create<UploadModalStore>()((set) => ({
  isOpen: false,

  openModal: () => set(() => ({ isOpen: true })),

  closeModal: () => set(() => ({ isOpen: false })),
}));

export default useUploadModalVisibilityState;
