import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_PUBLISHING } from '@/graphql/Publishing/PublishingQueries';

export const useGetPublishing = () => {
    const [getPublishing, { data, loading, error }] = useLazyQuery(GET_PUBLISHING);

    const GetPublishing = async () => {
        try {
            await getPublishing();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getPublishing: GetPublishing,
        data,
        loading,
        error,
    };
};