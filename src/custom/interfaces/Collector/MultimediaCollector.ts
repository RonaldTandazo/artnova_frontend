export interface MultimediaCollectorProps {
    type: string;
    onUpdate: (type: string, files: FileInterface[]) => void;
    files: FileInterface[];
    onError: (errorMessage: string | undefined) => void;
}

export interface FileInterface {
    originalFile: File | string | undefined;
    crop: File | undefined;
    display: string;
};