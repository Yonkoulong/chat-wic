import { create } from 'zustand';

export const useRoomStore = create((set) => ({
    roomInfo: {},
    typeFeatureRoom: null,
    typeRoom: null,

    setRoomInfo: (payload) => {
        set({ roomInfo: payload });
    },

    setTypeRoom: (type) => {
        set({ typeRoom: type });
    },

    setTypeFeatureRoom: (payload) => {
        set({ typeFeatureRoom: payload });
    }
}))