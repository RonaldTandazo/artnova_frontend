import { gql } from "@apollo/client";

export const GET_FOLLOWING_STATE = gql`
    query GetFollowState($data: FollowStateInput!) { 
        getFollowState(data: $data){
            isFollowed
        }
    }
`;