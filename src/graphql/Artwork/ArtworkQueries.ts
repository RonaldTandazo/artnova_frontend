import { gql } from '@apollo/client/core';
import { Stats } from '../ArtworkComment/ArtworkStatisticsQueries';

export const ArtVerseArtWorksPayload = gql`
    fragment ArtVerseArtWork on ArtworkPayload {
        artworkId
        title
        thumbnail
        publishingId
        hasImages
        hasVideos
        has3DFile
        owner
        avatar
        createdAt
    }
`;

export const GET_ARTVERSE_ARTWORKS = gql`    
    query GetArtVerseArtworks{ 
        getArtVerseArtworks{
            ...ArtVerseArtWork
        }
    }
    ${ArtVerseArtWorksPayload}
`;

export const GET_USER_ARTWORKS = gql`    
    query GetUserArtworks($data: UserVariablesInput!){ 
        getUserArtworks(data: $data){
            artworkId
            title
            thumbnail
            publishingId
            scheduleAt
            stats{
                ...Stats
            }
        }
    }
    ${Stats}
`;

export const GET_ARTWORK_FORM_DATA = gql`    
    query GetArtworkFormData{ 
        getArtworkFormData{
            publishing{
                publishingId
                name
                type
            }
            categories{
                categoryId
                name
            }
            topics{
                topicId
                name
            }
            softwares{
                softwareId
                name
            }
        }
    }
`;

const StandardPayload = gql`
    fragment StandardFields on StandardPayload {
        value
        label
    }
`;

const ArtworkOwner = gql`
    fragment ArtworkOwner on ArtworkOwnerPayload {
        userId
        username
        avatar
    }
`;

export const GET_ARTWORK_DETAILS = gql`    
    query GetArtworkDetails($artworkId: Int!){ 
        getArtworkDetails(artworkId: $artworkId){
            artworkId
            title
            description
            matureContent
            categories {
                ...StandardFields
            }
            topics {
                ...StandardFields
            }
            softwares {
                ...StandardFields
            }
            publishingId
            thumbnail
            images
            videos
            owner{
                ...ArtworkOwner
            }
            createdAt
        }
    }
    ${ArtworkOwner}
    ${StandardPayload}
`;