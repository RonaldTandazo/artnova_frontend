import { gql } from "@apollo/client";

export const SET_CHAT_MESSAGE = gql`
    mutation SetChatMessage($chat: SetChatInput!) { 
        setChatMessage(chat: $chat){
            chatId
        }
    }
`;

export const DELETE_CHAT = gql`
    mutation DeleteChat($input: DeleteChatInput!) { 
        deleteChat(input: $input)
    }
`;