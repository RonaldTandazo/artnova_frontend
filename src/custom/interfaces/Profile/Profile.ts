import { Artwork } from "./ArtistContent";

export interface GetUserArtworks {
    getUserArtworks: Artwork[];
}

export interface GetArtworksWS {
    newArtwork: NewArtworkWS;
}

export interface NewArtworkWS {
    artwork: Artwork;
}