import { gql } from '@apollo/client/core';

const Comment = gql`
    fragment Comment on ArtworkCommentPayload {
        commentId
        userId
        username
        avatar
        comment
        likes
        dislikes
        createdAt
    }
`;

export const Stats = gql`
    fragment Stats on ArtworkStatsPayload {
        viewsAmount
        likes
        dislikes
        favorites
        commentsAmount
    }
`;

export const GET_ARTWORK_STATISTICS = gql`    
    query GetArtworkStatistics($artworkId: Int!){ 
        getArtworkStatistics(artworkId: $artworkId){
            stats{
                ...Stats
            }
            comments{
                commentId
                userId
                username
                avatar
                comment
                likes
                dislikes
                replies{
                    ...Comment
                }
                createdAt
            }
        }
    }
    ${Comment}
    ${Stats}
`;