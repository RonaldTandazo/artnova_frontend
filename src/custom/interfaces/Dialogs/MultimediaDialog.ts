export interface MultimediaDialogProps {
    type: string;
    isOpen: boolean;
    fileURL: string | undefined;
    onClose: () => void;
    onComplete: (croppedImage: string) => void;
    aspectRatio?: number; 
}