import { create } from 'zustand';
import { getMembersByOrganizeId } from '@/services/member.service';

export const useMemberStore = create((set) => ({
    members: [],
    filtermember: "",
    paging: {},
    totalRecord: 0,
    fetchMember: async () => {
        
    }
}));
