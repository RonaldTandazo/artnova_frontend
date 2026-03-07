import { Artwork } from "../Profile/ArtistContent";

export interface ArtworkItemProps {
    artwork: Artwork;
    isOpen: boolean;
    onMenuToggle: (artworkId: number | undefined) => void;
    isOwnProfile: boolean | undefined;
    onDelete: (artworkId: number[]) => void;
}