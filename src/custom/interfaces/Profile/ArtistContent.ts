import { ArtworkStats } from "../ArtworkView/ArtworkView";

export interface Artwork {
    artworkId: number;
    title: string;
    thumbnail: string;
    publishingId: number;
    scheduleAt?: string | null;
    stats: ArtworkStats
}

export interface ArtistContentProps {
    artworks: Artwork[];
    isUserInfoVisible: boolean; 
    isOwnProfile: boolean;
    openMenuId: number | undefined; 
    onNewArt: () => void;
    onMenuOpen: (artworkId: number | undefined) => void;
    onDelete: (artworkIds: number[]) => void
}