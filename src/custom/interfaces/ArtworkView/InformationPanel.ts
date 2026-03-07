import { User } from "../general/GeneralInterfaces";
import { ArtworkInformation, ArtworkStats } from "./ArtworkView";

export interface InformationPanelProps {
    user: User | undefined;
    artworkData: ArtworkInformation | undefined;
    artworkStatistics: ArtworkStats | undefined;
    onLike: (likes: number[], data: OnLikeData) => void;
    onDisLike: (dislikes: number[], data: OnDislikeData) => void;
    onFavorites: (favorites: number[], data: OnFavoritesData) => void;
    toProfile: (userId: number | undefined) => string;
    checkAuthentication: () => void;
};

export interface OnLikeData {
    artworkId: number;
    likes: number[];
}

export interface OnDislikeData {
    artworkId: number;
    dislikes: number[];
}

export interface OnFavoritesData {
    artworkId: number;
    favorites: number[];
}