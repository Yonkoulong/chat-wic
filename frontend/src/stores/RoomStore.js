import { create } from 'zustand';

export const useRoomStore = create((set) => ({
    roomInfo: {},
    enumPopupFeatures: null,
    typeRoom: null,

    setRoomInfo: (payload) => {
        set({ roomInfo: payload });
    },

    setTypeRoom: (type) => {
        set({ typeRoom: type });
    }
}))