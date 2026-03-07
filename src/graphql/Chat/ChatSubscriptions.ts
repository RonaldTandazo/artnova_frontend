import { gql } from "@apollo/client";

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSent($chatId: String!) {
    messageSent(chatId: $chatId) {
      chatId
      messageId
      userId
      typeMessage
      message
      createdAt
      date
    }
  }
`;