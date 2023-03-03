import React from 'react';
import { RoomChatContainer } from './Room.styles';

import { RoomHeader, RoomContent, BoxMessage } from './components';

export const RoomChat = () => {
    
    return ( 
        <RoomChatContainer>
            <RoomHeader />
            <RoomContent />
            <BoxMessage />
        </RoomChatContainer>
    )
}