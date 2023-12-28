import { create } from "zustand";
import { getMessageChannelByChannelId } from "@/services/channel.services";
import { getMessageByDirectId } from "@/services/direct.services";

export const useChatStore = create((set, get) => ({
  messages: null,
  listQuoteMessageChannel: [],
  listQuoteMessageDirect: [],
  editMessage:  null,
  heightQuoteMessageBox: 0,
  loading: false,

  setEditMessage: (payload) => {
    set({ editMessage: payload });
  },
  setHeightQuoteMessageBox: (payload) => {
    set({ heightQuoteMessageBox: payload });
  },
  setListQuoteMessageChannel: (payload) => {
    const isQuoteMessage = get().listQuoteMessageChannel?.some((quoteMessageChannel) => {
      quoteMessageChannel.channelId == payload.channelId;
    });
    if(isQuoteMessage) {
      const newListQuoteMessage = get().listQuoteMessageChannel.filter((quoteMessageChannel) => {
        quoteMessageChannel.channelId != payload.channelId;
      })
      set({ listQuoteMessageChannel: [...newListQuoteMessage, payload]})
    } else {
      set((state) => ({ listQuoteMessageChannel: [...state.listQuoteMessageChannel, payload] }));
    }
  },
  setListQuoteMessageDirect: (payload) => {
    const isQuoteMessage = get().listQuoteMessageDirect.some((quoteMessageDirect) => {
      quoteMessageDirect.directId == payload.directId;
    });
    if(isQuoteMessage) {
      const newListQuoteMessage = get().listQuoteMessageDirect.filter((quoteMessageDirect) => {
        quoteMessageDirect.directId != payload.directId;
      })
      set({ listQuoteMessageDirect: [...newListQuoteMessage, payload]})
    } else {
      set((state) => ({ listQuoteMessageDirect: [...state.listQuoteMessageDirect, payload] }));
    }
  },
  setDeleteQuoteMessageChannel: (idQuoteMessage) => {
    set((state) => ({ 
      listQuoteMessageChannel: state.listQuoteMessageChannel?.filter((quoteMessage) => quoteMessage?._id !== idQuoteMessage) 
    }));
  },
  setDeleteQuoteMessageDirect: (idQuoteMessage) => {
    set((state) => ({ 
      listQuoteMessageDirect: state.listQuoteMessageDirect?.filter((quoteMessage) => quoteMessage?._id !== idQuoteMessage) 
    }));
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
  reactionMessage: (payload) => {
    const newListMessage = get().messages.map(msg => {
      if(msg?._id == payload?._id) {
        return {...msg, reactions: payload?.reactions}
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
