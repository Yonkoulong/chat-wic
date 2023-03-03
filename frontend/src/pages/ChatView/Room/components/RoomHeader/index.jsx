import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UilCommentMessageIcon } from '@/assets/icons';

export const RoomHeader = () => {

    return (
        <RoomHeaderContainer>
            <RoomHeaderWrapper>
                <RoomHeaderList>
                    <RoomHeaderItem>
                        <RoomHeaderItemImage src="/"/>
                        <RoomHeaderItemName></RoomHeaderItemName>
                    </RoomHeaderItem>
                    <RoomHeaderItem>
                        <PhoneIcon />
                        <UilCommentMessageIcon />
                        <GroupIcon />
                        <SearchIcon />
                        <MoreVertIcon />
                    </RoomHeaderItem>
                </RoomHeaderList>
            </RoomHeaderWrapper>
        </RoomHeaderContainer>
    )
}