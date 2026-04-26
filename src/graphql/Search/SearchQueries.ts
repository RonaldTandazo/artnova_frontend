import { gql } from '@apollo/client/core';
import { ArtVerseArtWorksPayload } from '../Artwork/ArtworkQueries';
import { ArtistInterface } from '../Chat/ChatQueries';

export const GET_SEARCH_RESULTS = gql`    
    query GetSearchResults($data: SearchInput!){ 
        getSearchResults(input: $data){
            artworks{
                ...ArtVerseArtWork
            }
            artists {
                ...ArtistInterface
            }
            hasMoreArtworks
            type
        }
    }
    ${ArtistInterface}
    ${ArtVerseArtWorksPayload}
`;