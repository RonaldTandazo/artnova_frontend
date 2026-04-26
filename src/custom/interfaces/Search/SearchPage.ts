import { ArtVerseArtWork } from "../ArtVerse/ArtVerse";

export interface GetSearchResults {
    getSearchResults: {
        artworks: ArtVerseArtWork[]
        artists: any[]
        hasMoreArtworks: boolean
        type: string
    };
}

export interface Results {
    artworks: ArtVerseArtWork[]
    artists: Artist[]
}

export interface Artist {
    artistId: number,
    username: string
    avatar: string | undefined
    cover: string | undefined
}