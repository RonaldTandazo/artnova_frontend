import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
    query GetUserGeneralData($data: ValidateAccessInput!) {
        getUserGeneralData(data: $data) {
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
            cover
        }
    }
`;

export const GET_USER_STATS_DATA = gql`
    query GetUserStats($data: ValidateAccessInput!) {
        getUserStats(data: $data) {
            followersCount
            followingCount
        }
    }
`;