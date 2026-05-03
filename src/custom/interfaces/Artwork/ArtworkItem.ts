import { Artwork } from "../Profile/ArtistContent";

export interface ArtworkItemProps {
    artwork: Artwork;
    isOpen: boolean;
    onMenuToggle: (artworkId: number | undefined) => void;
    isOwnProfile: boolean | undefined;
    isManageMode: boolean;
    isSelected: boolean;
    onSelectItem: (artwork: Artwork) => void;
    setOpenModal: (isOpen: boolean) => void;
}