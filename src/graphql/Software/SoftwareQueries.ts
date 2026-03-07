import { gql } from '@apollo/client/core';

export const GET_SOFTWARE = gql`    
    query GetSoftware{ 
        getSoftware { 
            softwareId 
            name
        }
    }
`;