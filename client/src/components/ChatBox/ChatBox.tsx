import React from "react";
import {
  ChatPageContentBox,
  ChatPageContentBoxFooter,
  ChatPageContentBoxFooterFeature,
  ChatPageContentBoxMessage,
  ChatPageContentBoxFooterTyping,
  ChatPageContentBoxFooterIpt
} from "./ChatBox.styles";

export const ChatBox = () => {
  return (
    <ChatPageContentBox>
      <ChatPageContentBoxMessage></ChatPageContentBoxMessage>
      
      <ChatPageContentBoxFooter sx={{ boxShadow: 2 }}>
        <ChatPageContentBoxFooterFeature></ChatPageContentBoxFooterFeature>
      
        <ChatPageContentBoxFooterTyping>
         <ChatPageContentBoxFooterIpt type="text" placeholder="Message"/>
        </ChatPageContentBoxFooterTyping>
      </ChatPageContentBoxFooter>
    </ChatPageContentBox>
  );
};
