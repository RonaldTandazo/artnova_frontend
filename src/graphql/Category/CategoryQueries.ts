import { gql } from '@apollo/client/core';

export const GET_CATEGORIES = gql`    
    query GetCategories{ 
        getCategories { 
            categoryId 
            name
        }
    }
`;