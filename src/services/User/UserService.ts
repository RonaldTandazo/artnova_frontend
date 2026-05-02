import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { STORE_USER_PCITURE, PROFILE_MUTATION, CHANGE_PASSWORD_MUTATION } from '@/graphql/User/UserMutations';
import { GetUserStats, ProfileUpdatePayload, StoreUserPicture, UserGeneralInterface } from '@/graphql/User/UserInterfaces';
import { GET_USER_DATA, GET_USER_STATS_DATA } from '@/graphql/User/UserQueries';
import { ValidateAccessInput } from '@/graphql/Authentication/AuthenticationInterfaces';

export const useGetUserData = () => {
    const [execute, { data, loading, error }] = useLazyQuery<UserGeneralInterface>(GET_USER_DATA, {
        fetchPolicy: 'network-only'
    });

    const getUserGeneralData = async (data: ValidateAccessInput) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        getUserGeneralData,
        data,
        loading,
        error,
    };
};

export const useGetUserStatsData = () => {
    const [execute, { data, loading, error }] = useLazyQuery<GetUserStats>(GET_USER_STATS_DATA, {
        fetchPolicy: 'network-only'
    });

    const getUserStats = async (data: ValidateAccessInput) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        getUserStats,
        data,
        loading,
        error,
    };
};

export const useStoreUserPicture = () => {
    const [userPictureMutation, { data, loading, error }] = useMutation<StoreUserPicture>(STORE_USER_PCITURE);

    const storeUserPicture = async (data: any) => {
        try {
            return await userPictureMutation({ 
                variables: { data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserPicture,
        data,
        loading,
        error,
    };
};

export const useProfileUpdate= () => {
    const [profileMutation, { data, loading, error }] = useMutation<ProfileUpdatePayload>(PROFILE_MUTATION);

    const profileUpdate = async (firstName: string, lastName: string, professionalHeadline: string, summary: string, city: string, countryId: number) => {
        try {
            const profileUpdate = { firstName, lastName, professionalHeadline, summary, city, countryId };
            return await profileMutation({ 
                variables: { profileUpdate }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        profileUpdate,
        data,
        loading,
        error,
    };
};

export const useChangePassword = () => {
    const [passwordMutation, { data, loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            return await passwordMutation({ 
                variables: { currentPassword, newPassword }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        changePassword,
        data,
        loading,
        error,
    };
};