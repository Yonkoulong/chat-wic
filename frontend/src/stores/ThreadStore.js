import { create } from "zustand";
import { getMessagesThread } from "@/services/thread.services";

export const useThreadStore = create((set, get) => ({
  messagesThread: null,
  quoteThreadMessage: null,
  editThreadMessage:  null,
  selectedThreadMessage: null,
  heightQuoteThreadMessageBox: 0,
  loading: false,

  setEditThreadMessage: (payload) => {
    set({ editThreadMessage: payload });
  },
  setSelectedThreadMessage: (payload) => {
    set({ selectedThreadMessage: payload });
  },
  setHeightQuoteThreadMessageBox: (payload) => {
    set({ heightQuoteThreadMessageBox: payload });
  },
  setQuoteThreadMessage: (payload) => {
    set({ quoteThreadMessage: payload });
  },
  setThreadMessages: (payload) => {
    set({ messagesThread: payload });
  },
  pushThreadMessage: (payload) => {
    set((state) => ({ messagesThread: [...state.messages, payload] }));
  },
  deleteThreadMessage: (payload) => {
    set((state) => ({ messagesThread: state.messages?.filter((msg) => msg?._id !== payload) }));
  },
  editThreadMessageStore: (payload) => {
    const newListMessageThread = get().messagesThread.map(msg => {
      if(msg?._id == payload?._id) {
        return {...msg, content: payload?.content}
      } else {
        return msg;
      }
    });
    set({ messagesThread: newListMessageThread })
  },
  reactionThreadMessage: (payload) => {
    const newListMessageThread = get().messagesThread.map(msg => {
      if(msg?._id == payload?._id) {
        console.log(payload);
        if(msg?.reactions?.length > 0 || msg?.reactions[0]) {
          msg.reactions.map((react) => {

          })
        } else {
          return {...msg, reactions: [payload?.reactions]}
        }
      } else {
        return msg;
      }
    });
    set({ messagesThread: newListMessageThread })
  },
  setLoading: (payload) => set({ loading: payload }),

  fetchMessagesThreadChannel: async (payload) => {
    const response = await getMessagesThread(payload);
    if (response) {
      // const { page, size, totalPage, totalRecord } = response?.data?.paging;
      set({ messagesThread: response?.data?.content });
      // set({ paging: { page, size } });
      // set({ totalRecord });
      set({ loading: false });
    }
  },
}));
