import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { DELETE_USER_ARTWORKS, STORE_ARTWORK } from '@/graphql/Artwork/ArtworkMutations';
import { GET_ARTVERSE_ARTWORKS, GET_USER_ARTWORKS, GET_ARTWORK_DETAILS, GET_ARTWORK_FORM_DATA, GET_ARTWORK_MODEL } from '@/graphql/Artwork/ArtworkQueries';
import { GetUserArtworks } from '@/custom/interfaces/Profile/Profile';
import { GetArtworkInformation, GetArtworkModel } from '@/custom/interfaces/ArtworkView/ArtworkView';
import { GetArtWorkFormData, StoreArtWork } from '@/custom/interfaces/NewArtwork/NewArtwork';
import { GetArtVerse } from '@/custom/interfaces/ArtVerse/ArtVerse';
import { ValidateAccessInput } from '@/graphql/Authentication/AuthenticationInterfaces';

export const useGetArtVerseArtworks = () => {
    const [getArtVerseArtworks, { loading, data, error }] = useLazyQuery<GetArtVerse>(GET_ARTVERSE_ARTWORKS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetArtVerseArtworks = async () => {
        try {
            await getArtVerseArtworks();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtVerseArtworks: GetArtVerseArtworks,
        data,
        loading,
        error,
    };
};

export const useGetUserArtworks = () => {
    const [execute, { loading, data, error }] = useLazyQuery<GetUserArtworks>(GET_USER_ARTWORKS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetUserArtworks = async (data: ValidateAccessInput) => {
        return execute({
            variables: { data }
        });
    };

    return {
        getUserArtworks: GetUserArtworks,
        data,
        loading,
        error,
    };
};

export const useDeleteUserArtworks = () => {
    const [deleteUserArtworks, { loading, data, error }] = useMutation(DELETE_USER_ARTWORKS);

    const DeleteUserArtworks = async (deleteArtworks: any) => {
        try {
            await deleteUserArtworks({ 
                variables: { deleteArtworks }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        deleteUserArtworks: DeleteUserArtworks,
        data,
        loading,
        error,
    };
};

export const useGetArtworkFormData = () => {
    const [getArtworkFormData, { loading, data, error }] = useLazyQuery<GetArtWorkFormData>(GET_ARTWORK_FORM_DATA)

    const GetArtworkFormData = async () => {
        try {
            await getArtworkFormData();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtworkFormData: GetArtworkFormData,
        data,
        loading,
        error,
    };
}

export const useStoreArtwork = () => {
    const [storeArtwork, { loading, data, error }] = useMutation<StoreArtWork>(STORE_ARTWORK);

    const StoreArtwork = async (artworkData: any) => {
        try {
            await storeArtwork({ 
                variables: { artworkData }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        storeArtwork: StoreArtwork,
        data,
        loading,
        error,
    };
};

export const useGetArtworkDetails = () => {
    const [getArtworkDetails, { loading, data, error }] = useLazyQuery<GetArtworkInformation>(GET_ARTWORK_DETAILS)

    const GetArtworkDetails = async (artworkId: number) => {
        try {
            await getArtworkDetails({ 
                variables: { artworkId }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtworkDetails: GetArtworkDetails,
        data,
        loading,
        error,
    };
};

export const useGetArtworkModel = () => {
    const [getArtworkModel, { loading, data, error }] = useLazyQuery<GetArtworkModel>(GET_ARTWORK_MODEL)
    
    const GetArtworkModel = async (artworkId: number) => {
        try {
            await getArtworkModel({ 
                variables: { artworkId }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtworkModel: GetArtworkModel,
        data,
        loading,
        error,
    };
};