import { create } from 'zustand';
import {
    getMessageChannelByChannelId,
} from "@/services/channel.services";
import { getMessageByDirectId } from "@/services/direct.services";

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

    fetchMessagesChannel: async (payload) => {
        const response = await getMessageChannelByChannelId(payload);
        if (response) {
            // const { page, size, totalPage, totalRecord } = response?.data?.paging;
            set({ messages: response?.data?.content });
            // set({ paging: { page, size } });
            // set({ totalRecord });
            set({ loading: false })
        }
    },
    fetchMessagesDirect: async (payload) => {
        const response = await getMessageByDirectId(payload);
        if (response) {
            // const { page, size, totalPage, totalRecord } = response?.data?.paging;
            set({ messages: response?.data?.content });
            // set({ paging: { page, size } });
            // set({ totalRecord });
            set({ loading: false })
        }
    },

}));