import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from '@/graphql/Category/CategoryQueries';

export const useGetCategory = () => {
    const [getCategories, { data, loading, error }] = useLazyQuery(GET_CATEGORIES);

    const GetCountries = async () => {
        try {
            await getCategories();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getCategories: GetCountries,
        data,
        loading,
        error,
    };
};