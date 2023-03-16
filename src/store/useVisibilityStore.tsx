import { create, createStore, useStore } from "zustand";

type VisibilityState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

/* const useVisibilityStore = create<VisibilityState>()((set) => ({
  isOpen: false,

  openModal: () => {
    set(() => ({ isOpen: true }));
  },

  closeModal: () => {
    set(() => ({ isOpen: false }));
  },
})); */
const store = createStore<VisibilityState>()((set) => ({
  isOpen: false,

  openModal: () => {
    set(() => ({ isOpen: true }));
  },

  closeModal: () => {
    set(() => ({ isOpen: false }));
  },
}));

const useVisibilityStore = () => {
  return useStore(store);
};

export default useVisibilityStore;
