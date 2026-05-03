import { SceneConfig } from "../3DFile/Upload3DFile";

export interface StoredModelViewerProps {
    modelFile: string | undefined;
    resources: string[] | undefined;
    config: SceneConfig;
    initialConfig: SceneConfig;
    setConfig: (config: SceneConfig) => void;
}

export interface RemoteModelProps {
    url: string,
    resources: string[],
    color: string
}