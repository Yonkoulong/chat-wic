import { create } from "zustand";
import { getMessageChannelByChannelId } from "@/services/channel.services";
import { getMessageByDirectId } from "@/services/direct.services";

export const useChatStore = create((set, get) => ({
  messages: null,
  quoteMessage: {},
  editMessage: {},
  heightQuoteMessageBox: 0,
  loading: false,

  setEditMessage: (payload) => {
    set({ editMessage: payload });
  },
  setHeightQuoteMessageBox: (payload) => {
    set({ heightQuoteMessageBox: payload });
  },
  setQuoteMessage: (payload) => {
    set({ quoteMessage: payload });
  },
  setMessages: (payload) => {
    set({ messages: payload });
  },
  pushMessage: (payload) => {
    set((state) => ({ messages: [...state.messages, payload] }));
  },
  deleteMessage: (payload) => {
    set((state) => ({ messages: state.messages?.filter((msg) => msg?._id !== payload) }));
  },
  editMessageStore: (payload) => {
    const newListMessage = get().messages.map(msg => {
      if(msg?._id == payload?._id) {
        return {...msg, content: payload?.content}
      } else {
        return msg;
      }
    });
    set({ messages: newListMessage })
  },
  setLoading: (payload) => set({ loading: payload }),

  fetchMessagesChannel: async (payload) => {
    const response = await getMessageChannelByChannelId(payload);
    if (response) {
      // const { page, size, totalPage, totalRecord } = response?.data?.paging;
      set({ messages: response?.data?.content });
      // set({ paging: { page, size } });
      // set({ totalRecord });
      set({ loading: false });
    }
  },
  fetchMessagesDirect: async (payload) => {
    const response = await getMessageByDirectId(payload);
    if (response) {
      // const { page, size, totalPage, totalRecord } = response?.data?.paging;
      set({ messages: response?.data?.content });
      // set({ paging: { page, size } });
      // set({ totalRecord });
      set({ loading: false });
    }
  },
}));
