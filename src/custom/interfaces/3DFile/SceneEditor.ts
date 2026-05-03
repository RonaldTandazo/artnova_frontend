import { SceneConfig } from "./Upload3DFile";

export interface SceneEditorProps {
    config: SceneConfig;
    setConfig: (config: SceneConfig) => void;
    onSaveAsDefault?: () => void;
    onReset?: () => void;
    allowSetDefault?: boolean;
}