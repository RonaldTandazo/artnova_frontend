export interface GetArtVerse {
    getArtVerseArtworks: ArtVerseArtWork[];
}

export interface ArtVerseArtWork {
    artworkId: number;
    title: string;
    thumbnail: string | null;
    publishingId: number;
    hasImages: boolean;
    hasVideos: boolean;
    has3DFile: boolean;
    owner: string;
    avatar: string | null;
    createdAt: string;
}