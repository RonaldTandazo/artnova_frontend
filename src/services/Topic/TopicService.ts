import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_TOPICS } from '@/graphql/Topic/TopicQueries';

export const useGetTopic = () => {
    const [getTopics, { data, loading, error }] = useLazyQuery(GET_TOPICS);

    const GetTopics = async () => {
        try {
            await getTopics();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getTopics: GetTopics,
        data,
        loading,
        error,
    };
};