import { create } from 'zustand';

export const useChatStore = create((set) => ({
    messages: [],

    setMessages: (payload) => {
        set({ messages: payload})
    }
}));