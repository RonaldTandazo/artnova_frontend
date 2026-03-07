import { gql } from '@apollo/client/core';

export const GET_PUBLISHING = gql`    
    query GetPublishing{ 
        getPublishing { 
            publishingId 
            name
        }
    }
`;