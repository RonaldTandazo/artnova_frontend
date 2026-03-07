import { Publishing } from "../general/GeneralInterfaces"
import { Category, Software, Topic } from "../ProfileSettings/ProfileSkillsInterests"

export interface GetArtWorkFormData {
    getArtworkFormData: {
        publishing: Publishing[],
        categories: Category[],
        topics: Topic[],
        softwares: Software[]
    }
}

export interface MultimediaFiles {
    type: string;
    files: FileInterface[];
}

export interface FileInterface {
    originalFile: File | string | undefined;
    crop: File | undefined;
    display: string | undefined;
};

export interface ArtWorkForm {
    status: number;
}

export interface StoreArtWork {
    storeArtwork: {
        artworkId: number; 
        title: string;
        thumbnail: string | undefined
    }
}