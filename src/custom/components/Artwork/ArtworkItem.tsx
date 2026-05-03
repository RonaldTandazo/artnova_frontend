import { useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { BACKEND_URL, encodeToBase64, formatSchedule } from "@/utils/Helpers";
import { Box, Checkbox, Grid, GridItem, Icon, Image, Menu, Portal, Separator, Show, Text } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { MdHideImage } from "react-icons/md";
import { ArtworkItemProps } from "@/custom/interfaces/Artwork/ArtworkItem";
import { Artwork } from "@/custom/interfaces/Profile/ArtistContent";
import { FaComments } from "react-icons/fa6";

const ArtworkItem = ({ 
    artwork, 
    isOpen, 
    onMenuToggle, 
    isOwnProfile,
    isManageMode,
    onSelectItem,
    isSelected,
    setOpenModal
}: ArtworkItemProps) => {
    const { colorMode }  = useColorMode();
    const navigate = useNavigate();

    const handleNavigateEditArtwork = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        const encodedModule = encodeToBase64('EditArtwork');

        const safeArtworkId = encodeURIComponent(encodedArtworkId);
        const safeModule = encodeURIComponent(encodedModule);
        
        navigate(`/ArtWorks/Edit/${safeArtworkId}/${safeModule}`);
    }

    const handleNavigateArtworkView = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);

        const safeArtworkId = encodeURIComponent(encodedArtworkId);

        navigate(`/ArtWorks/View/${safeArtworkId}`);
    }

    const handleCloseMenu = () => onMenuToggle(isOpen ? undefined : artwork.artworkId);

    return (
        <>
            <GridItem 
                key={artwork.artworkId} 
                w="full" 
                h="full" 
                colSpan={1}
                overflow="hidden"
                borderRadius={"sm"}
                display="flex"
                flexDirection="column"
                position="relative"
                transition="all 0.3s ease"
                borderWidth="2px"
                borderColor={isManageMode && isSelected 
                    ? (colorMode === 'light' ? "teal.500":'pink.500')
                    : "transparent"
                }
                boxShadow={isManageMode && isSelected
                    ? (colorMode === 'light' 
                        ? "0 0 30px rgba(45, 170, 150, 0.6)" 
                        : "0 0 30px rgba(213, 63, 140, 0.6)")
                    : "none"
                }
                _hover={isManageMode ? { transform: "scale(1.02)" } : {}}
            >
                <Show when={isManageMode}>
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        zIndex={10}
                        cursor="pointer"
                        bg={isSelected ? "blackAlpha.400" : "transparent"}
                        onClick={() => onSelectItem(artwork)}
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        p={3}
                    >
                        <Checkbox.Root
                            colorPalette={colorMode === 'light' ? "teal":'pink'}
                            bg={"whiteAlpha.700"}
                            checked={isSelected}
                            readOnly
                            size={"md"}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                        </Checkbox.Root>
                    </Box>
                </Show>

                <Box
                    w={"full"}
                    h={"full"}
                    cursor={"pointer"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bgGradient={!artwork.thumbnail ? "to-br" : undefined}
                    gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                    gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                    color={'whiteAlpha.950'}
                    onClick={() => {
                        if(!isManageMode && (artwork.publishingId == 1 || artwork.publishingId == 2)){
                            handleNavigateArtworkView(artwork)
                        }
                    }}
                >
                    <Show
                        when={artwork.thumbnail}
                        fallback={
                            <Icon
                                as={MdHideImage}
                                cursor="pointer"
                                size={"2xl"}
                            />
                        }
                    >
                        <Image
                            src={`${BACKEND_URL}/thumbnails/${artwork.thumbnail}`} 
                            alt={`${artwork.title}`} 
                            cursor={"pointer"}
                            objectFit="cover"
                        />
                    </Show>
                </Box>

                <Box 
                    p={2} 
                    bg={"blackAlpha.950"}
                    color={"white"}
                >
                    <Grid
                        templateColumns="repeat(4, 1fr)"
                        display={"flex"}
                        justifyContent={
                            artwork.publishingId === 3 || artwork.publishingId === 4 
                            ? "space-evenly"
                            : "space-around"
                        }
                        alignItems={"center"}
                    >
                        <Show 
                            when={artwork.publishingId === 1 || artwork.publishingId === 2}
                            fallback={
                                <GridItem
                                    colSpan={3}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Show
                                        when={artwork.publishingId === 3}
                                        fallback={
                                            <Box textAlign="center">
                                                <Text fontWeight={"semibold"}>Scheduled</Text>
                                                <Text fontSize="sm">
                                                    {formatSchedule(artwork.scheduleAt!)}
                                                </Text>
                                            </Box>
                                        }
                                    >
                                        <Text textAlign="center">
                                            Draft
                                        </Text>
                                    </Show>
                                </GridItem>
                            }
                        >
                            <Tooltip
                                content={`${artwork.stats.viewsAmount} View/s`}
                                openDelay={200}
                                closeDelay={100}
                                unmountOnExit={true}    
                                lazyMount={true}
                                positioning={{ placement: "top" }}
                                showArrow
                                contentProps={{ 
                                    css: { 
                                        "--tooltip-bg": colorMode === "light" ? "colors.teal.400":"colors.pink.600",
                                        'color': 'white'
                                    }
                                }}
                            >    
                                <GridItem 
                                    colSpan={1} 
                                    display={"flex"} 
                                    alignItems={"center"} 
                                    justifyContent={"center"}
                                >
                                    <IoEye />
                                    <Text fontSize={"md"} ml={2}>
                                        {artwork.stats.viewsAmount}
                                    </Text>
                                </GridItem>
                            </Tooltip>

                            <Tooltip
                                content={`${artwork.stats.likes.length} Like/s`}
                                openDelay={200}
                                closeDelay={100}
                                unmountOnExit={true}    
                                lazyMount={true}
                                positioning={{ placement: "top" }}
                                showArrow
                                contentProps={{ 
                                    css: { 
                                        "--tooltip-bg": colorMode === "light" ? "colors.teal.400":"colors.pink.600",
                                        'color': 'white'
                                    }
                                }}
                            >    
                                <GridItem 
                                    colSpan={1}
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <BiSolidLike />
                                    <Text fontSize={"md"} ml={2}>
                                        {artwork.stats.likes.length}
                                    </Text>
                                </GridItem>
                            </Tooltip>

                            <Tooltip
                                content={`${artwork.stats.commentsAmount} Comment/s`}
                                openDelay={200}
                                closeDelay={100}
                                unmountOnExit={true}    
                                lazyMount={true}
                                positioning={{ placement: "top" }}
                                showArrow
                                contentProps={{ 
                                    css: { 
                                        "--tooltip-bg": colorMode === "light" ? "colors.teal.400":"colors.pink.600",
                                        'color': 'white'
                                    }
                                }}
                            >    
                                <GridItem 
                                    colSpan={1}
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <FaComments />
                                    <Text fontSize={"md"} ml={2}>
                                        {artwork.stats.commentsAmount}
                                    </Text>
                                </GridItem>
                            </Tooltip>
                        </Show>

                        <Show
                            when={isOwnProfile && !isManageMode}
                        >
                            <GridItem 
                                colSpan={1}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                cursor={"pointer"}
                            >
                                <Menu.Root unmountOnExit lazyMount open={isOpen} onInteractOutside={handleCloseMenu}>
                                    <Menu.Trigger asChild onClick={handleCloseMenu}>
                                        <BsThreeDotsVertical />
                                    </Menu.Trigger>
                                    <Portal>
                                        <Menu.Positioner>
                                            <Menu.Content minW={"1px"}>
                                                <Menu.Arrow />

                                                <Menu.Item 
                                                    value={'edit'}
                                                    justifyContent={'flex-start'}
                                                    alignItems={'center'}
                                                    onClick={() => handleNavigateEditArtwork(artwork)}
                                                    cursor={"pointer"}
                                                >
                                                    <Icon size={'sm'} color={colorMode === 'light' ? 'teal.400' : 'pink.600'}>
                                                        <AiFillEdit />
                                                    </Icon>

                                                    <Text>
                                                        Edit
                                                    </Text>
                                                </Menu.Item>

                                                <Separator my={1} />
                                                
                                                <Menu.Item 
                                                    value={'delete'}
                                                    color="fg.error"
                                                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                                                    justifyContent={'flex-start'}
                                                    alignItems={'center'}
                                                    cursor={"pointer"}
                                                    onClick={() => {
                                                        onSelectItem(artwork)
                                                        setOpenModal(true);
                                                    }}
                                                >
                                                    <Icon size={'sm'}>
                                                        <TiDelete />
                                                    </Icon>

                                                    <Text>
                                                        Remove
                                                    </Text>
                                                </Menu.Item>
                                            </Menu.Content>
                                        </Menu.Positioner>
                                    </Portal>
                                </Menu.Root>
                            </GridItem>
                        </Show>         
                    </Grid>
                </Box>
            </GridItem>
        </>
    );
};

export default ArtworkItem;