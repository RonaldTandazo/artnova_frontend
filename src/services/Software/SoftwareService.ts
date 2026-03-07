import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_SOFTWARE } from '@/graphql/Software/SoftwareQueries';

export const useGetSoftware = () => {
    const [getSoftwares, { data, loading, error }] = useLazyQuery(GET_SOFTWARE);

    const GetSoftwares = async () => {
        try {
            await getSoftwares();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getSoftwares: GetSoftwares,
        data,
        loading,
        error,
    };
};