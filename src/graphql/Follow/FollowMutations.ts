import { gql } from "@apollo/client";

export const SET_FOLLOWING_STATE = gql`
    mutation SetFollowState($data: FollowStateInput!) { 
        setFollowState(data: $data)
    }
`;

export const UNSET_FOLLOWING_STATE = gql`
    mutation UnsetFollowState($data: FollowStateInput!) { 
        unsetFollowState(data: $data)
    }
`;