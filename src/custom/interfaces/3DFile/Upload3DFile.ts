export interface Upload3DFileProps {
    onUpdate: (file: ModelFileInterface) => void;
    onError: (errorMessage: string | undefined) => void;
}

export interface ModelFileInterface {
    originalFile: File;
    display: string | undefined;
    assetMap?: Map<string, string>,
    allURLs?: string[];
    allFiles?: File[];
    type: string;
}

export interface SceneConfig {
    cameraPosition?: [number, number, number];
    cameraTarget?: [number, number, number];
    lightPosition: [number, number, number];
    intensity: number[];
    environment: ("city" | "sunset" | "warehouse" | "night" | "apartment" | "dawn" | "forest" | "lobby" | "park" | "studio")[];
    backgroundColor: string;
    contactShadow: boolean;
    autoRotate: boolean;
    exposure: number[];
    lockCameraReset: boolean;
    lockInteraction: boolean;
    modelColor: string;
}