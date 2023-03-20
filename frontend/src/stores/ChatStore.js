import { create } from 'zustand';
import {
    getMessageChannelByChannelId,
} from "@/services/channel.services";

export const useChatStore = create((set) => ({
    messages: [],
    quoteMessage: {},
    editMessage: {},
    heightQuoteMessageBox: 0,
    loading: false,

    setEditMessage: (payload) => {
        set({ editMessage: payload })
    },
    setHeightQuoteMessageBox: (payload) => {
        set({ heightQuoteMessageBox: payload })
    },
    setQuoteMessage: (payload) => {
        set({ quoteMessage: payload })
    },
    setMessages: (payload) => {
        set({ messages: payload })
    },
    setLoading: (payload) => set({ loading: payload }),

    fetchMessages: async (payload) => {
        const response = await getMessageChannelByChannelId(payload);
        if (response) {
            // const { page, size, totalPage, totalRecord } = response?.data?.paging;
            set({ messages: response?.data?.content });
            // set({ paging: { page, size } });
            // set({ totalRecord });
            set({ loading: false })
        }
    },

}));