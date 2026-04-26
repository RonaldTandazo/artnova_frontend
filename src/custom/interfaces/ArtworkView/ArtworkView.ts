import { SelectOptions } from "../General/GeneralInterfaces"

export interface GetArtworkInformation {
    getArtworkDetails: ArtworkInformation
};

export interface ArtworkInformation {
    artworkId: number
    title: string
    description: string | null
    matureContent: boolean
    categories: SelectOptions[]
    topics: SelectOptions[]
    softwares: SelectOptions[]
    publishingId: number
    thumbnail: string | null
    images: string[]
    videos: string[]
    owner: ArtworkOwner
    createdAt: string
};

export interface ArtworkOwner {
    userId: number
    username: string
    avatar: string | null
};

export interface ArworkStatistics {
    getArtworkStatistics: {
        stats: ArtworkStats;
        comments: ArtworkComment[];
    }
};

export interface ArtworkStats {
    viewsAmount: number
    likes: number[]
    dislikes: number[]
    favorites: number[]
    commentsAmount: number
};

export interface ArtworkComment {
    commentId: string
    userId: number
    username: string
    avatar: string | null
    comment: string
    likes: number[]
    dislikes: number[]
    replies: any[]
    createdAt: string
};