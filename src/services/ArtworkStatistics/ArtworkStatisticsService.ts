import { ArworkStatistics } from '@/custom/interfaces/ArtworkView/ArtworkView';
import { DELETE_COMMENT, POST_COMMENT, STORE_ARTWORK_VIEWS, UPDATE_ARTWORK_DISLIKES, UPDATE_ARTWORK_FAVORITES, UPDATE_ARTWORK_LIKES, UPDATE_COMMENT_DISLIKES, UPDATE_COMMENT_LIKES } from '@/graphql/ArtworkComment/ArtworkStatisticsMutations';
import { GET_ARTWORK_STATISTICS } from '@/graphql/ArtworkComment/ArtworkStatisticsQueries';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation, useLazyQuery } from "@apollo/client/react";

export const useGetArtworkStatistics = () => {
    const [execute, { loading, data, error }] = useLazyQuery<ArworkStatistics>(GET_ARTWORK_STATISTICS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetArtworkStatistics = async (artworkId: number) => {
        execute({
            variables: { artworkId }
        });
    };

    return {
        getArtworkStatistics: GetArtworkStatistics,
        data,
        loading,
        error,
    };
};

export const useStoreArtworkViews = () => {
    const [execute, { loading, data, error }] = useMutation(STORE_ARTWORK_VIEWS)

    const StoreArtworkViews = async (artworkId: number) => {
        return execute({ 
            variables: { artworkId }
        });
    };

    return {
        storeArtworkViews: StoreArtworkViews,
        data,
        loading,
        error,
    };
};

export const usePostArtworkComment = () => {
    const [postArtworkComment, { loading, data, error }] = useMutation(POST_COMMENT)

    const PostArtworkComment = async (postCommentData: any) => {
        try {
            await postArtworkComment({ 
                variables: { postCommentData }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        postArtworkComment: PostArtworkComment,
        data,
        loading,
        error,
    };
};

export const useDeleteArtworkComment = () => {
    const [deleteArtworkComment, { loading, data, error }] = useMutation(DELETE_COMMENT)

    const DeleteArtworkComment = async (deleteCommentData: any) => {
        try {
            await deleteArtworkComment({ 
                variables: { deleteCommentData }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        deleteArtworkComment: DeleteArtworkComment,
        data,
        loading,
        error,
    };
};

export const useUpdateArtworkLikes = () => {
    const [updateArtworkLikes, { loading, data, error }] = useMutation(UPDATE_ARTWORK_LIKES)

    const UpdateArtworkLikes = async (data: any) => {
        try {
            await updateArtworkLikes({ 
                variables: { updateArtworkLikesData: data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateArtworkLikes: UpdateArtworkLikes,
        data,
        loading,
        error,
    };
};

export const useUpdateArtworkDisLikes = () => {
    const [updateArtworkDisLikes, { loading, data, error }] = useMutation(UPDATE_ARTWORK_DISLIKES)

    const UpdateArtworkDisLikes = async (data: any) => {
        try {
            await updateArtworkDisLikes({ 
                variables: { updateArtworkDisLikesData: data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateArtworkDisLikes: UpdateArtworkDisLikes,
        data,
        loading,
        error,
    };
};

export const useUpdateArtworkFavorites = () => {
    const [updateArtworkFavorites, { loading, data, error }] = useMutation(UPDATE_ARTWORK_FAVORITES)

    const UpdateArtworkFavorites = async (data: any) => {
        try {
            await updateArtworkFavorites({ 
                variables: { updateArtworkFavoritesData: data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateArtworkFavorites: UpdateArtworkFavorites,
        data,
        loading,
        error,
    };
};

export const useUpdateCommentLikes = () => {
    const [updateCommentLikes, { loading, data, error }] = useMutation(UPDATE_COMMENT_LIKES)

    const UpdateCommentLikes = async (data: any) => {
        try {
            await updateCommentLikes({ 
                variables: { updateCommentLikesData: data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateCommentLikes: UpdateCommentLikes,
        data,
        loading,
        error,
    };
};

export const useUpdateCommentDisLikes = () => {
    const [updateCommentDisLikes, { loading, data, error }] = useMutation(UPDATE_COMMENT_DISLIKES)

    const UpdateCommentDisLikes = async (data: any) => {
        try {
            await updateCommentDisLikes({ 
                variables: { updateCommentDisLikesData: data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        updateCommentDisLikes: UpdateCommentDisLikes,
        data,
        loading,
        error,
    };
};