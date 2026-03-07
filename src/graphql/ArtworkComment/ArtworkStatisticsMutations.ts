import { gql } from '@apollo/client/core';

export const STORE_ARTWORK_VIEWS = gql`
    mutation StoreArtworkViews($artworkId: Int!) { 
        storeArtworkViews(artworkId: $artworkId)
    }
`;

export const POST_COMMENT = gql`
    mutation ($postCommentData: PostCommentInput!) { 
        postArtworkComment(postCommentData: $postCommentData)
    }
`;

export const DELETE_COMMENT = gql`
    mutation ($deleteCommentData: DeleteCommentInput!) { 
        deleteArtworkComment(deleteCommentData: $deleteCommentData)
    }
`;

export const UPDATE_ARTWORK_LIKES = gql`
    mutation ($updateArtworkLikesData: UpdateArtworkLikesInput!) { 
        updateArtworkLikes(updateArtworkLikesData: $updateArtworkLikesData)
    }
`;

export const UPDATE_ARTWORK_DISLIKES = gql`
    mutation ($updateArtworkDisLikesData: UpdateArtworkDisLikesInput!) { 
        updateArtworkDisLikes(updateArtworkDisLikesData: $updateArtworkDisLikesData)
    }
`;

export const UPDATE_ARTWORK_FAVORITES = gql`
    mutation ($updateArtworkFavoritesData: UpdateArtworkFavoritesInput!) { 
        updateArtworkFavorites(updateArtworkFavoritesData: $updateArtworkFavoritesData)
    }
`;

export const UPDATE_COMMENT_LIKES = gql`
    mutation ($updateCommentLikesData: UpdateCommentLikesInput!) { 
        updateCommentLikes(updateCommentLikesData: $updateCommentLikesData)
    }
`;

export const UPDATE_COMMENT_DISLIKES = gql`
    mutation ($updateCommentDisLikesData: UpdateCommentDisLikesInput!) { 
        updateCommentDisLikes(updateCommentDisLikesData: $updateCommentDisLikesData)
    }
`;