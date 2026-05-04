import { useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Spinner, IconButton, Icon, Show } from '@chakra-ui/react';
import { FaPlay, FaCube, FaMobileAlt } from 'react-icons/fa';
import { BACKEND_URL, FACTORY_SETTINGS } from '@/utils/Helpers';
import { useColorMode } from '@/components/ui/color-mode';
import { ModelViewerLoaderProps } from '@/custom/interfaces/ArtworkView/ModelViewerLoader';
import { useGetArtworkModel } from '@/services/Artwork/ArtworkService';
import { SceneConfig } from '@/custom/interfaces/3DFile/Upload3DFile';
import StoredModelViewer from './StoredModelViewer';
import QRDialog from '../../Dialogs/QRDialog';

const ModelViewerLoader = ({ 
    artworkId,
    thumbnail
}: ModelViewerLoaderProps) => {
    const { colorMode } = useColorMode();
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [modelFile, setModelFile] = useState<string | undefined>(undefined);
    const [resources, setResources] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<SceneConfig>(FACTORY_SETTINGS);
    const [initialConfig, setInitialConfig] = useState<SceneConfig>(FACTORY_SETTINGS);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { getArtworkModel: GetArtworkModel, data: artworkModelData } = useGetArtworkModel();

    useEffect(() => {
        if(artworkModelData && artworkModelData?.getArtworkModel){
            setIsModelLoaded(true);
            setIsLoadingModel(false);
            setModelFile(`${BACKEND_URL}/models/${artworkId}/${artworkModelData.getArtworkModel.mainFile}`);
            setResources(artworkModelData.getArtworkModel.resources.map((resource) => `${BACKEND_URL}/models/${artworkId}/${resource}`));
            setConfig(artworkModelData.getArtworkModel.settings)
            setInitialConfig(artworkModelData.getArtworkModel.settings)
        }

    }, [artworkModelData])

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const handleLoadModel = async () => {
        if (artworkId) {
            setIsLoadingModel(true);
            
            if (artworkModelData?.getArtworkModel) {
                setIsModelLoaded(true);
                setIsLoadingModel(false);
                return;
            }

            GetArtworkModel(artworkId);
        }
    };

    const handleAR = () => {
        if (isAndroid) {
            if(modelFile){
                const encodedFile = encodeURIComponent(modelFile);
                const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodedFile}&mode=ar_only#Intent;scheme=https;package=com.google.android.googleview;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
                
                window.location.href = sceneViewerUrl;
            }
        } else if(isIOS){
            alert("AR sooooon!");
        } else {
            setIsModalOpen(true)
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <Box
            position="relative"
            width="100%"
            height="1000px"
            bg="black"
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
        >
            <Show
                when={!isModelLoaded}
                fallback={
                    <Box w="100%" h="100%" zIndex={1}>
                        <StoredModelViewer
                            modelFile={modelFile}
                            resources={resources}
                            config={config}
                            initialConfig={initialConfig}
                            setConfig={setConfig}
                        />

                        <Show
                            when={!isIOS}
                        >
                            <IconButton
                                aria-label="View in AR"
                                position="absolute"
                                bottom={4}
                                right={16}
                                size="sm"
                                variant="ghost"
                                color="whiteAlpha.600"
                                _hover={{ color: (colorMode === 'light' ? 'teal.400':'pink.600') }}
                                onClick={handleAR}
                            >
                                <FaMobileAlt />
                            </IconButton>
                        </Show>                        

                        <IconButton
                            aria-label="Exit 3D"
                            position="absolute"
                            bottom={4}
                            right={4}
                            size="sm"
                            variant="ghost"
                            color="whiteAlpha.600"
                            _hover={{ color: (colorMode === 'light' ? 'teal.400':'pink.600') }}
                            onClick={() => {
                                setIsModelLoaded(false)
                                setConfig(initialConfig)
                            }}
                        >
                            <FaCube/>
                        </IconButton>
                    </Box>
                }
            >
                <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    direction="column"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    onClick={handleLoadModel}
                    role="group"
                    zIndex={2}
                >
                    <Show
                        when={thumbnail && thumbnail != ''}
                        fallback={
                            <Box
                                w={"full"}
                                h={"full"}
                                bgGradient={"to-br"}
                                gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                                gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                                position="absolute"
                                top={0}
                                left={0}
                            />
                        }
                    >
                        <Image
                            src={`${BACKEND_URL}/thumbnails/${thumbnail}`}
                            alt="3D Model Preview"
                            objectFit="contain"
                            w="100%"
                            h="100%"
                            position="absolute"
                            opacity={0.6}
                            _groupHover={{ opacity: 0.4, transform: 'scale(1.05)' }}
                            transition="all 0.4s ease"
                        />
                    </Show>

                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        zIndex={3}
                        transition="transform 0.2s"
                        _groupHover={{ transform: 'scale(1.1)' }}
                    >
                        <Box
                            bg="brand.magenta"
                            p={6}
                            borderRadius="full"
                            boxShadow="0 0 20px rgba(255, 0, 128, 0.4)"
                            mb={4}
                        >
                            <Show
                                when={isLoadingModel}
                                fallback={
                                    <Icon as={FaPlay} color="white" w={8} h={8} ml={1} />
                                }
                            >
                                <Spinner color="white" />
                            </Show>
                        </Box>
                        <Flex align="center" bg="blackAlpha.700" px={4} py={1} borderRadius="full">
                            <Icon as={FaCube} mr={2} color="whiteAlpha.800" />
                            <Text color="white" fontWeight="bold" fontSize="sm" letterSpacing="wider">
                                {isLoadingModel ? "LOADING REALTIME 3D MODEL..." : "VIEW 3D MODEL"}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Show>

            <QRDialog
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </Box>
    );
};

export default ModelViewerLoader;