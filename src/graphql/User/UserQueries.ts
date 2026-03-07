import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
    query GetUserGeneralData($userId: Int!) {
        getUserGeneralData(userId: $userId) {
            userId
            firstName
            lastName
            username
            summary
            professionalHeadline
            location
            city
            avatar
            since
            chatId
        }
    }
`;