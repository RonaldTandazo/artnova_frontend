import { CombinedGraphQLErrors } from '@apollo/client';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { GET_USER_SOCIAL_MEDIA } from '@/graphql/UserSocialNetwork/UserSocialNetworkQueries';
import { REMOVE_USER_NETWORK, STORE_USER_NETWORK, UPDATE_USER_NETWORK } from '@/graphql/UserSocialNetwork/UserSocialNetworkMutations';
import { GetUserSocialMedia } from '@/custom/interfaces/ProfileSettings/ProfileSocialMedia';
import { ValidateAccessInput } from '@/graphql/Authentication/AuthenticationInterfaces';

export const useGetUserSocialMedia = () => {
    const [execute, { data, loading, error }] = useLazyQuery<GetUserSocialMedia>(GET_USER_SOCIAL_MEDIA);

    const GetUserSocialMedia = async (data: ValidateAccessInput) => {
        return execute({
            variables: { data }
        });
    };

    return {
        getUserSocialMedia: GetUserSocialMedia,
        data,
        loading,
        error,
    };
};

export const useStoreUserSocialNetowrk= () => {
    const [socialNetowrkMutation, { data, loading, error }] = useMutation(STORE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

    const storeUserNetwork = async (socialMediaId: number, link: string) => {
        try {
            const storeUserNetwork = { socialMediaId, link };
            return await socialNetowrkMutation({ 
                variables: { storeUserNetwork }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserNetwork,
        data,
        loading,
        error,
    };
};

export const useUpdateUserSocialNetowrk= () => {
    const [updateSocialNetowrkMutation, { data, loading, error }] = useMutation(UPDATE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

    const updateUserNetwork = async (userSocialNetworkId: number, socialMediaId: number, link: string) => {
        try {
            const updateUserNetwork = { userSocialNetworkId, socialMediaId, link };
            return await updateSocialNetowrkMutation({ 
                variables: { updateUserNetwork }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateUserNetwork,
        data,
        loading,
        error,
    };
};

export const useRemoveUserSocialNetowrk= () => {
    const [removeUserNetowrkMutation, { data, loading, error }] = useMutation(REMOVE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

    const removeUserNetwork = async (userSocialNetworkId: number) => {
        try {
            return await removeUserNetowrkMutation({ 
                variables: { userSocialNetworkId }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        removeUserNetwork,
        data,
        loading,
        error,
    };
};