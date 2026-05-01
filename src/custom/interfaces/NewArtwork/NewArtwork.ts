import { FileInterface } from "../Collector/MultimediaCollector";
import { Publishing } from "../General/GeneralInterfaces"
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