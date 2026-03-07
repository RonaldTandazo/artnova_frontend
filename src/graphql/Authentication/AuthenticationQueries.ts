import { gql } from '@apollo/client/core';

export const VALIDATE_USER_ACCESS = gql`
    query ValidateUserAccess($data: ValidateAccessInput!) {
        validateUserAccess(data: $data) {
            validate
        }
    }
`;