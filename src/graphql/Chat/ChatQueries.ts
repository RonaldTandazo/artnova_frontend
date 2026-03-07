import { gql } from "@apollo/client";

const ArtistMessage = gql`
    fragment ArtistMessage on ArtistPayload {
        artistId
        username
        avatar
    }
`;

const LastMessage = gql`    
    fragment LastMessage on LastMessagePayload {
        message
        date
        userId
    }
`;

export const GET_CHATS = gql`
    query GetChats($pagination: PaginationInput!){ 
        getChats(pagination: $pagination){
            chatId
            artist {
                ...ArtistMessage
            }
            lastMessage {
                ...LastMessage
            }
            isFollowing
            isBlocked
            hasBlockedMe
        }
    }
    ${ArtistMessage}
    ${LastMessage}
`;

const ChatMessage = gql`
    fragment ChatMessage on ChatMessagePayload {
        chatId
        messageId
        userId
        typeMessage
        message
        createdAt
        date
    }
`;

export const GET_CHAT_ARTIST = gql`
    query GetChatArtist($chatId: String!, $pagination: PaginationInput!) { 
        getChatArtist(chatId: $chatId, pagination: $pagination) {
            messages {
                ...ChatMessage
            }
            hasMore
        }
    }
    ${ChatMessage}
`;
    
