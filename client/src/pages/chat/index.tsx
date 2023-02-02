import React from "react";

import {
  ChatPageContainer,
  ChatPageContent,
  ChatPageContentHeader,
  ChatPageContentHeaderTitle,
  ChatPageContentHeaderTitleIcon,
  ChatPageContentHeaderTitleHeading, 
  ChatPageContentHeaderList, 
  ChatPageContentHeaderItem,
  ChatPageContentMain,
} from "./chatPage.styles";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ChatBox } from "../../components/ChatBox/ChatBox";

function ChatPage() {
  return (
    <ChatPageContainer>
        <Sidebar />

        <ChatPageContent>
            <ChatPageContentHeader sx={{ boxShadow: 1 }}>
                <ChatPageContentHeaderTitle>
                    <ChatPageContentHeaderTitleIcon>#</ChatPageContentHeaderTitleIcon>
                    <ChatPageContentHeaderTitleHeading>Test</ChatPageContentHeaderTitleHeading>
                </ChatPageContentHeaderTitle>

                <ChatPageContentHeaderList>
                    <ChatPageContentHeaderItem></ChatPageContentHeaderItem>
                </ChatPageContentHeaderList>
            </ChatPageContentHeader>

            <ChatPageContentMain>
                <ChatBox />
            </ChatPageContentMain>

        </ChatPageContent>
    </ChatPageContainer>
    );
}

export default ChatPage;
