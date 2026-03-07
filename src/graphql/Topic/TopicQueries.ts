import { gql } from '@apollo/client/core';

export const GET_TOPICS = gql`    
    query GetTopics{ 
        getTopics { 
            topicId 
            name
        }
    }
`;