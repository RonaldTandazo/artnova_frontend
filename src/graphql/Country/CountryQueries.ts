import { gql } from '@apollo/client/core';

export const GET_COUNTRIES = gql`    
    query GetCountries{ 
        getCountries { 
            countryId 
            name
        }
    }
`;