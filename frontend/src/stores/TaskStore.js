import { create } from 'zustand';
import { getTasksByChannelId } from '@/services/task.services';

export const useTaskStore = create((set) => ({
    tasks: [],
    filterTask: "",
    paging: {page: 1, size: 10},
    totalRecord: 0,
    loading: false,

    fetchTasksByChannel: async (channelId, payload) => {
        const response = await getTasksByChannelId(channelId, payload);
        if(response) {
            // const {page, size, totalPage, totalRecord } = response?.data?.paging;
            
            set({ tasks: response?.data?.content });
            // set({ paging: {page, size} });
            // set({ totalRecord });
            set({ loading: false })
        }
    },

    setLoading: (payload) => set({ loading: payload})
}));
