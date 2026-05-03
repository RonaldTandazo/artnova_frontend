import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import * as THREE from 'three';
import { LocalModelProps, ModelViewerProps } from '@/custom/interfaces/3DFile/ModelViewer';
import { LuImagePlus, LuTrash2 } from 'react-icons/lu';
import { useColorMode } from '@/components/ui/color-mode';
import { SceneConfig } from '@/custom/interfaces/3DFile/Upload3DFile';
import { GLTFLoader } from 'three-stdlib';
import { FACTORY_SETTINGS } from '@/utils/Helpers';
import SceneEditor from './SceneEditor';

function LocalModel({ 
    fileObject,
    color
}: LocalModelProps) {
    const manager = useMemo(() => {
        const m = new THREE.LoadingManager();
        m.setURLModifier((url) => {
            if (fileObject.assetMap) {
                const fileName = url.split('/').pop() || "";
                const blobUrl = fileObject.assetMap.get(fileName);
                if (blobUrl) return blobUrl;
            }
            return url;
        });

        return m;
    }, [fileObject]);

    const gltf = useLoader(GLTFLoader, fileObject.display as string, (loader) => {
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

const ModelViewer = ({ 
    fileObject,
    config,
    setConfig,
    onRemove,
    onAddTextures
}: ModelViewerProps) => {
    const { colorMode } = useColorMode();
    const orbitRef = useRef<any>(null);
    const [initialConfig, setInitialConfig] = useState<SceneConfig>(FACTORY_SETTINGS);

    const textureInputRef = useRef<HTMLInputElement>(null);

    if (!fileObject) return null;

    const handleTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onAddTextures(Array.from(e.target.files));
    };

    const handleSaveAsDefault = () => {
        setInitialConfig(config);
    };

    const handleReset = () => {
        setConfig(initialConfig);
        if (orbitRef.current) orbitRef.current.reset();
    };

    return (
        <Box 
            h="1000px"
            w="full"
            borderRadius="md"
            position="relative"
            overflow="hidden"
        >
            <SceneEditor 
                config={config} 
                setConfig={setConfig} 
                onSaveAsDefault={handleSaveAsDefault}
                onReset={handleReset}
            />

            <HStack position="absolute" top={4} right={4} zIndex={10} gap={2}>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={textureInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleTextureChange}
                />
                
                <Button
                    size="xs"
                    bg={colorMode === "light" ? "teal.400" : "pink.600"}
                    color={"white"}
                    onClick={() => textureInputRef.current?.click()}
                >
                    <LuImagePlus /> Add Textures
                </Button>

                <Button 
                    size="xs"
                    bg={"red.500"}
                    color={"white"}
                    onClick={onRemove}
                >
                    <LuTrash2 /> Remove Model
                </Button>
            </HStack>

            <Box position="absolute" bottom={4} left={4} zIndex={10}>
                <Text color="whiteAlpha.600" fontSize="xs">
                    {fileObject.originalFile?.name} ({fileObject.type.toUpperCase()})
                </Text>
            </Box>
            
            <Canvas 
                shadows
                gl={{ 
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: config.exposure[0] 
                }}
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <color attach="background" args={[config.backgroundColor]} />

                <Suspense fallback={null}>
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
                        <LocalModel fileObject={fileObject} color={config.modelColor} />
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

export default ModelViewer;