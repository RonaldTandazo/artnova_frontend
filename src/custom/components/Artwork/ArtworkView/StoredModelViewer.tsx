import { Box } from "@chakra-ui/react";
import { OrbitControls, Stage } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { GLTFLoader } from "three-stdlib";
import * as THREE from 'three';
import SceneEditor from "../SceneEditor";
import { RemoteModelProps, StoredModelViewerProps } from "@/custom/interfaces/ArtworkView/StoredModelViewer";

function RemoteModel({ 
    url,
    resources,
    color
}: RemoteModelProps) {
    const resourceMap = useMemo(() => {
        const map = new Map<string, string>();
        resources.forEach(resUrl => {
            const fileName = resUrl.split('/').pop();
            if (fileName) map.set(fileName, resUrl);
        });
        return map;
    }, [resources]);

    const gltf = useLoader(GLTFLoader, url, (loader) => {
        const manager = new THREE.LoadingManager();

        manager.setURLModifier((requestUrl) => {
            const fileName = requestUrl.split('/').pop() || "";
            if (resourceMap.has(fileName)) {
                return resourceMap.get(fileName)!;
            }
            return requestUrl;
        });

        loader.manager = manager;
    });

    useEffect(() => {
        if (gltf) {
            gltf.scene.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    // (child as THREE.Mesh).material.color.set(color);
                }
            });
        }
    }, [gltf, color]);

    return <primitive object={gltf.scene} />;
}

const StoredModelViewer = ({ 
    modelFile,
    resources,
    config,
    setConfig,
    initialConfig
}: StoredModelViewerProps) => {
    const orbitRef = useRef<any>(null);
    
    if (!modelFile) return null;

    const handleReset = () => {
        setConfig(initialConfig);
        if (orbitRef.current) orbitRef.current.reset();
    };
    
    return (
        <Box h="full" w="full" position="relative">
            <SceneEditor 
                config={config} 
                setConfig={setConfig}
                onReset={handleReset}
                allowSetDefault={false}
            />

            <Canvas 
                shadows
                gl={{ 
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: config.exposure[0] 
                }}
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <color attach="background" args={[config.backgroundColor]} />
                <Suspense 
                    fallback={null}
                >
                    <directionalLight 
                        position={config.lightPosition}
                        intensity={config.intensity[0]} 
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <Stage
                        intensity={0}
                        environment={config.environment[0]} 
                        shadows={config.contactShadow ? "contact" : false}
                        adjustCamera={!config.lockCameraReset}
                    >
                        <RemoteModel url={modelFile!} resources={resources!} color={config.modelColor} />
                    </Stage>
                </Suspense>
                <OrbitControls
                    ref={orbitRef}
                    makeDefault
                    autoRotate={config.autoRotate}
                    enabled={!config.lockInteraction}
                />
            </Canvas>
        </Box>
    );
};

export default StoredModelViewer