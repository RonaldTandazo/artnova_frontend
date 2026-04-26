import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_SEARCH_RESULTS } from '@/graphql/Search/SearchQueries';
import { GetSearchResults } from '@/custom/interfaces/Search/SearchPage';

export const useGetSearchResults = () => {
    const [getSearchResults, { loading, data, error }] = useLazyQuery<GetSearchResults>(GET_SEARCH_RESULTS, {
        fetchPolicy: 'network-only'
    })

    const GetSearchResults = async (data: any) => {
        try {
            await getSearchResults({
                variables: { data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getSearchResults: GetSearchResults,
        data,
        loading,
        error,
    };
};