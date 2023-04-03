import { create } from "zustand";

export const useSocketStore = create((set) => ({
  client: null,
  setClient: (payload) => {
    set({ client: payload });
  },
}));
