import { gql } from "@apollo/client";

export const STORE_USER_PCITURE = gql`
    mutation StoreUserPicture($data: StorePictureInput!) { 
        storeUserPicture(data: $data){
            label
            value
        }
    }
`;

const UpdatedValues = gql`
    fragment UpdatedProfileValues on ProfileUpdated {
        firstName
        lastName
        professionalHeadline
        summary
        countryId
        city
    }
`;

export const PROFILE_MUTATION = gql`
    mutation ProfileUpdate($profileUpdate: ProfileInput!) { 
        profileUpdate(profileUpdate: $profileUpdate){
            message
            values{
                ...UpdatedProfileValues
            }
        }
    }
    ${UpdatedValues}
`;

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
    }
`;