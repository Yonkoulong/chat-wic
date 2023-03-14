import { create } from 'zustand';

export const useChatStore = create((set) => ({
    messages: [],
    quoteMessage: {},
    heightQuoteMessageBox: 0,

    setHeightQuoteMessageBox: (payload) => {
        set({ heightQuoteMessageBox: payload })
    },
    setQuoteMessage: (payload) => {
        set({ quoteMessage: payload })
    },
    setMessages: (payload) => {
        set({ messages: payload })
    }
}));