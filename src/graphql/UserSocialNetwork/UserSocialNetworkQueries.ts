import { gql } from "@apollo/client";


export const GET_USER_SOCIAL_MEDIA = gql`
    query GetUserSocialMedia($data: ValidateAccessInput!) { 
        getUserSocialMedia(data: $data) { 
            userSocialNetworkId 
            socialMediaId 
            network
            link
        }
    }
`;