import { gql } from "@apollo/client";
import { ArtVerseArtWorksPayload } from "../Artwork/ArtworkQueries";

export const GET_FAVORITES_ARTWORKS = gql`    
    query GetUserFavoritesArtworks{ 
        getUserFavoritesArtworks{
            ...ArtVerseArtWork
        }
    }
    ${ArtVerseArtWorksPayload}
`;