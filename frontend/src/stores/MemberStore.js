import { create } from 'zustand';
import { getMembersByOrganizeId } from '@/services/member.service';

export const useMemberStore = create((set) => ({
    members: [],
    filterMember: "",
    paging: {page: 1, size: 10},
    totalRecord: 0,
    loading: false,

    fetchMembers: async (payload) => {
        const response = await getMembersByOrganizeId(payload);
        if(response) {
            const {page, size, totalPage, totalRecord } = response?.data?.paging;
            set({ members: response?.data?.content });
            set({ paging: {page, size} });
            set({ totalRecord });
            set({ loading: false })
        }
    },

    setLoading: (payload) => set({ loading: payload})
}));
