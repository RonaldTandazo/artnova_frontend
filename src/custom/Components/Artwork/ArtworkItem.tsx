import { useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { BACKEND_URL, encodeToBase64 } from "@/utils/Helpers";
import { Box, Grid, GridItem, Icon, Image, Menu, Portal, Separator, Show, Text } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { MdHideImage } from "react-icons/md";
import { ArtworkItemProps } from "@/custom/interfaces/Artwork/ArtworkItem";
import { Artwork } from "@/custom/interfaces/Profile/ArtistContent";
import { useState } from "react";
import WarningDialog from "../Dialogs/WarningDialog";
import { DeleteItem } from "@/custom/interfaces/Dialogs/WarningDialog";
import { FaComments } from "react-icons/fa6";

const ArtworkItem = ({ 
    artwork, 
    isOpen, 
    onMenuToggle, 
    isOwnProfile, 
    onDelete
}: ArtworkItemProps) => {
    const { colorMode }  = useColorMode();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleteItems, setDeleteItems] = useState<DeleteItem[]>([]);

    const handleNavigateEditArtwork = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        navigate(`/ArtWorks/${artwork.title}/${encodedArtworkId}/Edit`, { state: { artwork } });
    }

    const handleNavigateArtworkView = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        navigate(`/ArtWorks/${artwork.title}/${encodedArtworkId}/View`);
    }

    const handleCloseMenu = () => {
        onMenuToggle(isOpen ? undefined : artwork.artworkId);
    }

    
    const toggleWarningDialog = (artwork: Artwork) => {
        handleCloseMenu();
        setIsModalOpen(true);
        setDeleteItems(prev => [...prev, {id: artwork.artworkId, name: artwork.title}])
    }

    const handleCloseDelete = () => {
        setIsModalOpen(false);
        setDeleteItems([])
    };
    
    const handleConfirmDelete = async (items: DeleteItem[]) => {
        handleCloseDelete();
        
        const artworkIds = items.map(item => Number(item.id));
        onDelete(artworkIds);
    };

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
            >
                <Box
                    w={"full"}
                    h={"full"}
                    cursor={"pointer"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                    color={'whiteAlpha.950'}
                    onClick={() => handleNavigateArtworkView(artwork)}
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
                    bg={colorMode === "light" ? "blackAlpha.300":"blackAlpha.950"}
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
                                                    {artwork.scheduleDate} {artwork.scheduleTime}
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
                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
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
                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
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
                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
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
                            when={isOwnProfile}
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
                                                <Menu.Item 
                                                    value={'edit'}
                                                    justifyContent={'flex-start'}
                                                    alignItems={'center'}
                                                    onClick={() => handleNavigateEditArtwork(artwork)}
                                                    cursor={"pointer"}
                                                >
                                                    <Icon size={'sm'} color={colorMode === 'light' ? 'cyan.600' : 'pink.600'}>
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
                                                    onClick={() => toggleWarningDialog(artwork)}
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

            <WarningDialog
                isOpen={isModalOpen}
                title={"Delete ArtWork"}
                message={`Are you sure you want to delete this ArtWork?`}
                items={deleteItems}
                onClose={handleCloseDelete}
                onComplete={handleConfirmDelete}
            />
        </>
    );
};

export default ArtworkItem;