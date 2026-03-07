import { useLazyQuery, useMutation } from '@apollo/client/react';
import { SET_FOLLOWING_STATE, UNSET_FOLLOWING_STATE } from '@/graphql/Follow/FollowMutations';
import { FollowingInterface, GetFollowStateInterface } from '@/graphql/Follow/FollowInterfaces';
import { GET_FOLLOWING_STATE } from '@/graphql/Follow/FollowQueries';

export const useGetFollowState = () => {
    const [execute, { data, loading, error }] = useLazyQuery<GetFollowStateInterface>(GET_FOLLOWING_STATE, {
        fetchPolicy: 'network-only'
    });

    const getFollowState = async (data: FollowingInterface) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        getFollowState,
        data,
        loading,
        error,
    };
};

export const useSetFollowState = () => {
    const [execute, { data, loading, error }] = useMutation(SET_FOLLOWING_STATE);

    const setFollowState = async (data: FollowingInterface) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        setFollowState,
        data,
        loading,
        error,
    };
};

export const useUnsetFollowState = () => {
    const [execute, { data, loading, error }] = useMutation(UNSET_FOLLOWING_STATE);

    const unsetFollowState = async (data: FollowingInterface) => {
        return execute({ 
            variables: { data }
        });
    };

    return {
        unsetFollowState,
        data,
        loading,
        error,
    };
};