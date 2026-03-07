import { gql } from '@apollo/client/core';

export const STORE_ARTWORK = gql`
    mutation ($artworkData: StoreArtworkInput!) { 
        storeArtwork(artworkData: $artworkData){
            artworkId,
            title,
            thumbnail
        }
    }
`;

export const DELETE_USER_ARTWORKS = gql`
    mutation ($deleteArtworks: DeleteUserArtworkInput!) { 
        deleteUserArtworks(deleteArtworks: $deleteArtworks)
    }
`;