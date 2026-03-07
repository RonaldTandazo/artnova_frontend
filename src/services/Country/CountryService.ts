import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_COUNTRIES } from '@/graphql/Country/CountryQueries';
import { GetCountries } from '@/custom/interfaces/general/GeneralInterfaces';

export const useGetCountry = () => {
    const [getCountries, { data, loading, error }] = useLazyQuery<GetCountries>(GET_COUNTRIES);

    const GetCountries = async () => {
        try {
            await getCountries();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getCountries: GetCountries,
        data,
        loading,
        error,
    };
};