import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, createListCollection, Editable, Flex, HStack, IconButton, Input, InputGroup, Portal, Select, Separator, Show, Slider, Switch, Text, VStack } from '@chakra-ui/react';
import * as THREE from 'three';
import { ModelViewerProps } from '@/custom/interfaces/3DFile/ModelViewer';
import { LuAnchor, LuChevronDown, LuChevronUp, LuImagePlus, LuSearch, LuSettings2, LuTrash2 } from 'react-icons/lu';
import { useColorMode } from '@/components/ui/color-mode';
import { ModelFileInterface, SceneConfig } from '@/custom/interfaces/3DFile/Upload3DFile';
import { GLTFLoader } from 'three-stdlib';
import { GrPowerReset } from 'react-icons/gr';
import { FACTORY_SETTINGS, settingsOptions } from '@/utils/Helpers';

function Model({ fileObject, color }: { fileObject: ModelFileInterface, color: string }) {
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
                    // Por ejemplo, si queremos teñir el modelo ligeramente
                    (child as THREE.Mesh).material.color.set(color);
                }
            });
        }
    }, [gltf, color]);

    return <primitive object={gltf.scene} />;
}

const ModelViewer = ({ fileObject, onRemove, onAddTextures }: ModelViewerProps) => {
    const { colorMode } = useColorMode();
    const orbitRef = useRef<any>(null);
    const [initialConfig, setInitialConfig] = useState<SceneConfig>(FACTORY_SETTINGS);
    const [config, setConfig] = useState<SceneConfig>(FACTORY_SETTINGS);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const renderEditableValue = (val: number, onChange: (n: number) => void) => (
        <Editable.Root 
            value={val.toString()} 
            onValueChange={(e) => onChange(parseFloat(e.value) || 0)}
            size={"sm"}
            w={"20%"}
        >
            <Editable.Preview border={"1px dashed"} borderColor={"whiteAlpha.950"} px={2} fontSize={"small"}/>
            <Editable.Input />
        </Editable.Root>
    );

    const textureInputRef = useRef<HTMLInputElement>(null);

    // const environments = useMemo(() => createListCollection({
    //     items: [
    //         { label: "City", value: "city" },
    //         { label: "Sunset", value: "sunset" },
    //         { label: "Warehouse", value: "warehouse" },
    //         { label: "Night", value: "night" },
    //         { label: "Apartment", value: "apartment" },
    //         { label: "Dawn", value: "dawn" },
    //         { label: "Forest", value: "forest" },
    //         { label: "Lobby", value: "lobby" },
    //         { label: "Park", value: "park" },
    //         { label: "Studio", value: "studio" },
    //     ],
    // }), []);

    if (!fileObject) return null;

    const shouldShow = (id: string) => filteredOptions.some(opt => opt.id === id);

    const filteredOptions = useMemo(() => {
        return settingsOptions.filter(opt => 
            opt.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const handleTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onAddTextures(Array.from(e.target.files));
    };

    const handleSaveAsDefault = () => {
        setInitialConfig(config);        
        console.log("Nueva configuración base establecida");
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
            <VStack 
                position="absolute" 
                left={4} top={4} zIndex={20} 
                bg="blackAlpha.900" 
                borderRadius="md" 
                color="white" 
                align="stretch"
                w="320px"
                shadow="2xl"
                border="1px solid"
                borderColor="whiteAlpha.300"
                maxH={isExpanded ? "80vh" : "fit-content"}
                p={4}
            >
                <HStack justify="space-between" cursor="pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <HStack gap={2}>
                        <LuSettings2 color={"white"} />
                        <Text fontWeight="bold" fontSize="md">Scene Editor</Text>
                    </HStack>
                    <IconButton size="xs" color="white">
                        {isExpanded ? <LuChevronUp /> : <LuChevronDown />}
                    </IconButton>
                </HStack>

                <Show
                    when={isExpanded}
                >
                    <>
                        <Separator my={2}/>

                        <InputGroup startElement={<LuSearch size={14} color="white" />} mb={1}>
                            <Input 
                                placeholder="Search Options..." 
                                size="sm" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                _placeholder={{ color: "gray.500" }}
                            />
                        </InputGroup>

                        <VStack align="stretch" gap={2}>
                            <Text 
                                fontSize="sm"
                                color="whiteAlpha.950"
                                fontWeight="bold"
                            >
                                Light Direction
                            </Text>
                            
                            {['X', 'Y', 'Z'].map((axis, index) => (
                                <Box key={axis}>
                                    <HStack justify="space-between" align="center" mb={1}>
                                        <Text 
                                            fontSize="12px"
                                            color="whiteAlpha.950"
                                            w={"80%"}
                                        >
                                            {axis} Axis
                                        </Text>
                                        {renderEditableValue(config.lightPosition[index], (e) => {
                                            const newPos = [...config.lightPosition] as [number, number, number];
                                            newPos[index] = e;
                                            setConfig({...config, lightPosition: newPos});
                                        })}
                                    </HStack>
                                    <Slider.Root 
                                        value={[config.lightPosition[index]]}
                                        min={-20} max={20} step={0.5}
                                        onValueChange={(e) => {
                                            const newPos = [...config.lightPosition] as [number, number, number];
                                            newPos[index] = e.value[0];
                                            setConfig({...config, lightPosition: newPos});
                                        }}
                                    >
                                        <Slider.Control><Slider.Track><Slider.Range bg="yellow.400"/></Slider.Track><Slider.Thumb index={0} /></Slider.Control>
                                    </Slider.Root>
                                </Box>
                            ))}
                        </VStack>
                        
                        <Box w={"full"}>
                            <HStack justify="space-between" align="center" mb={3}>
                                <Text 
                                    fontSize="sm"
                                    color="whiteAlpha.950"
                                    w={"80%"}
                                >
                                    Lighting Intensity
                                </Text>
                                {renderEditableValue(config.intensity[0], (n) => setConfig({...config, intensity: [n]}))}
                            </HStack>
                            <Slider.Root 
                                value={config.intensity}
                                onValueChange={(e) => setConfig({...config, intensity: e.value})}
                                min={0}
                                max={10}
                                step={0.1}
                            >
                                <Slider.Control>
                                    <Slider.Track bg="whiteAlpha.200">
                                        <Slider.Range bg="teal.400" />
                                    </Slider.Track>
                                    <Slider.Thumb index={0} />
                                </Slider.Control>
                            </Slider.Root>
                        </Box>

                        <Box  w={"full"}>
                            <HStack justify="space-between" align="center" mb={3}>
                                <Text 
                                    fontSize="sm"
                                    color="whiteAlpha.950"
                                    w={"80%"}
                                >
                                    Exposure
                                </Text>
                                {renderEditableValue(config.exposure[0], (n) => setConfig({...config, exposure: [n]}))}
                            </HStack>
                            <Slider.Root 
                                value={config.exposure}
                                onValueChange={(e) => setConfig({...config, exposure: e.value})}
                                min={0} max={3} step={0.01}
                            >
                                <Slider.Control>
                                    <Slider.Track bg="whiteAlpha.200">
                                        <Slider.Range bg="pink.400" />
                                    </Slider.Track>
                                    <Slider.Thumb index={0} />
                                </Slider.Control>
                            </Slider.Root>
                        </Box>

                        {/* <Box>
                            <Text 
                                fontSize="sm"
                                mb={2}
                                color="whiteAlpha.950"
                            >
                                Environment Map
                            </Text>
                            <Select.Root
                                collection={environments}
                                value={config.environment}
                                onValueChange={(e) => setConfig({...config, environment: e.value as SceneConfig['environment']})}
                            >
                                <Select.Control>
                                    <Select.Trigger bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300">
                                        <Select.ValueText placeholder="Select environment" />
                                    </Select.Trigger>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner zIndex={20}>
                                        <Select.Content bg="#111" borderColor="whiteAlpha.300">
                                            {environments.items.map((env) => (
                                                <Select.Item item={env} key={env.value} _hover={{ bg: "whiteAlpha.200" }}>
                                                    {env.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Box> */}

                        <HStack justify="space-between" align={"center"}>
                            <Text 
                                fontSize="sm"
                                color="whiteAlpha.950"
                            >
                                Contact Shadows
                            </Text>
                            <Switch.Root
                                checked={config.contactShadow}
                                onCheckedChange={(e) => setConfig({...config, contactShadow: e.checked})}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                            </Switch.Root>
                        </HStack>

                        <HStack justify="space-between" align={"center"}>
                            <Text 
                                fontSize="sm"
                                color="whiteAlpha.950"
                            >
                                Auto Rotate
                            </Text>
                            <Switch.Root
                                checked={config.autoRotate}
                                onCheckedChange={(e) => setConfig({...config, autoRotate: e.checked})}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                            </Switch.Root>
                        </HStack>

                        <HStack justify="space-between" align={"center"}>
                            <Text 
                                fontSize="sm"
                                color="whiteAlpha.950"
                            >
                                Fixed Framing (Stage)
                            </Text>
                            <Switch.Root 
                                checked={config.lockCameraReset} 
                                onCheckedChange={(e) => setConfig({...config, lockCameraReset: e.checked})}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                            </Switch.Root>
                        </HStack>

                        <HStack justify="space-between" align={"center"}>
                            <Text 
                                fontSize="sm"
                                color="whiteAlpha.950"
                            >
                                Freeze Mouse (Orbit)
                            </Text>
                            <Switch.Root 
                                checked={config.lockInteraction} 
                                onCheckedChange={(e) => setConfig({...config, lockInteraction: e.checked})}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                            </Switch.Root>
                        </HStack>

                        <HStack justify="space-between" align={"center"} gap={1}>
                            <Text fontSize="sm" color="whiteAlpha.950">Background Color</Text>
                            <VStack>
                                <input 
                                    type="color" 
                                    value={config.backgroundColor}
                                    onChange={(e) => setConfig({...config, backgroundColor: e.target.value})}
                                    style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                {/* <Text fontSize="xs">{config.backgroundColor}</Text> */}
                            </VStack>
                        </HStack>

                        <Separator my={2}/>
                        
                        <HStack justify={"space-between"} align={"center"} gap={2}>
                            <Button 
                                size="xs"
                                flex={1}
                                bg={colorMode === "light" ? "teal.400" : "pink.600"}
                                color={"white"}
                                onClick={handleSaveAsDefault}
                                fontSize={"sm"}
                            >
                                <LuAnchor /> Set as Default
                            </Button>
                            <Button
                                size={"xs"}
                                flex={1} 
                                bg={"red.500"}
                                color={"white"}
                                onClick={handleReset}
                                fontSize={"md"}
                            >
                                <GrPowerReset /> Reset
                            </Button>
                        </HStack>
                    </>
                </Show>
            </VStack>

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
                    {/* <Environment 
                        preset={config.environment[0]}
                        background
                        blur={0.5}
                    /> */}

                    <directionalLight 
                        position={config.lightPosition}
                        intensity={config.intensity[0]} 
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* <mesh position={config.lightPosition}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshBasicMaterial color="yellow" />
                    </mesh> */}

                    <Stage 
                        intensity={0}
                        environment={config.environment[0]} 
                        shadows={config.contactShadow ? "contact" : false}
                        adjustCamera={!config.lockCameraReset}
                    >
                        <Model fileObject={fileObject} color={config.modelColor} />
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