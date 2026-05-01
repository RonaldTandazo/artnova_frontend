import { ModelFileInterface } from "./Upload3DFile";

export interface ModelViewerProps {
    fileObject: ModelFileInterface;
    onRemove: () => void;
    onAddTextures: (newTextureFiles: File[]) => void;
}