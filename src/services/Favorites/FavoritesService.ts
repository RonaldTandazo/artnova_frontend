import { GetUserFavoritesArtworks } from "@/custom/interfaces/Favorites/Favorites";
import { GET_FAVORITES_ARTWORKS } from "@/graphql/Favorites/FavoritesQueries";
import { useLazyQuery } from "@apollo/client/react";

export const useGetUserFavoritesArtworks = () => {
    const [execute, { loading, data, error }] = useLazyQuery<GetUserFavoritesArtworks>(GET_FAVORITES_ARTWORKS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetUserFavoritesArtworks = async () => {
        return execute({
            variables: { data }
        });
    };

    return {
        getUserFavoritesArtworks: GetUserFavoritesArtworks,
        data,
        loading,
        error,
    };
};