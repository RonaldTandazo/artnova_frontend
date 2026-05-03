import { ModelFileInterface, SceneConfig } from "./Upload3DFile";

export interface ModelViewerProps {
    fileObject: ModelFileInterface;
    config: SceneConfig;
    setConfig: (config: SceneConfig) => void;
    onRemove: () => void;
    onAddTextures: (newTextureFiles: File[]) => void;
}

export interface LocalModelProps {
    fileObject: ModelFileInterface;
    color: string;
}