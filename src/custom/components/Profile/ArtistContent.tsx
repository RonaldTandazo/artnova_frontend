import { Box, Button, Flex, For, Grid, GridItem, Heading, HStack, Show, Spacer, Stack, } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import Empty from "../States/Empty";
import ArtworkItem from "../Artwork/ArtworkItem";
import { FaPaintBrush } from "react-icons/fa";
import { ArtistContentProps, Artwork } from "@/custom/interfaces/Profile/ArtistContent";
import { ImCogs } from "react-icons/im";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { SelectedItem } from "@/custom/interfaces/Dialogs/WarningDialog";
import WarningDialog from "../Dialogs/WarningDialog";

const ArtistContent = ({ 
    artworks,
    isUserInfoVisible,
    isOwnProfile,
    openMenuId,
    onNewArt,
    onMenuOpen,
    onDelete 
 }: ArtistContentProps) => {
    const { colorMode } = useColorMode();
    const [isManageMode, setIsManageMode] = useState<boolean>(false)
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if(isManageMode && artworks.length == 0) setIsManageMode(false);
    }, [artworks])

    const handleSelectItem = (artwork: Artwork) => {
        setSelectedItems(prev => {
            const exists = prev.some(item => item.id === artwork.artworkId);

            if (exists) {
                return prev.filter(item => item.id !== artwork.artworkId);
            } else {
                return [...prev, { id: artwork.artworkId, name: artwork.title }];
            }
        });
    };

    const isItemSelected = (artwork: Artwork) => selectedItems.some((item) => item.id === artwork.artworkId);

    const handleCloseDelete = () => {
        setIsModalOpen(false);
        setSelectedItems([]);
    };
        
    const handleConfirmDelete = async (items: SelectedItem[]) => {
        handleCloseDelete();
        
        const artworkIds = items.map(item => Number(item.id));
        onDelete(artworkIds);
    };
    
    return (
        <>
            <GridItem
                style={{ gridColumn: isUserInfoVisible ? "2 / 3" : "1 / 2" }}
                w={"full"}
            >
                <Stack gap="5" align="flex-start">
                    <Flex direction={"row"} mb={0} justifyContent="space-between" width="full" alignItems={"center"}>
                        <Heading size={"3xl"}>ArtWorks</Heading>
                        
                        <Spacer />
                        
                        <Show
                            when={isOwnProfile}
                        >
                            <HStack alignItems={"center"} gap={1}>
                                <Button
                                    size="sm"
                                    bg={colorMode === "light" ? "teal.400" : "pink.600"}
                                    color={"white"}
                                    shadow={"md"}
                                    onClick={() => {
                                        setSelectedItems([])
                                        setIsManageMode(!isManageMode)
                                    }}
                                    borderRadius={"md"}
                                    disabled={artworks.length == 0}
                                >
                                    <Show
                                        when={!isManageMode}
                                        fallback={
                                            <>
                                                <MdCancel /> Cancel
                                            </>
                                        }
                                    >
                                        <ImCogs /> Manage
                                    </Show>
                                </Button>
                                <Button
                                    size="sm"
                                    bg={colorMode === "light" ? "teal.400" : "pink.600"}
                                    color={"white"}
                                    shadow={"md"}
                                    onClick={onNewArt}
                                    borderRadius={"md"}
                                >
                                    <FaPaintBrush /> New ArtWork
                                </Button>
                            </HStack>
                        </Show>
                    </Flex>
                    <Show
                        when={isOwnProfile && isManageMode}
                    >
                        <HStack width="full" alignItems={"center"}>                            
                            <Button
                                size="sm"
                                bg={colorMode === "light" ? "teal.400" : "pink.600"}
                                color={"white"}
                                shadow={"md"}
                                onClick={() => setIsModalOpen(true)}
                                disabled={selectedItems.length == 0}
                                borderRadius={"md"}
                            >
                                <MdCancel /> Delete Selected ArtWorks
                            </Button>
                        </HStack>
                    </Show>
                    <Box
                        bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
                        rounded={"lg"}
                        shadow={"lg"}
                        p={7}
                        w={"full"}
                        overflowY={"clip"}
                    >
                        <Show 
                            when={artworks && artworks.length > 0} 
                            fallback={
                                <Empty
                                    title="No ArtWorks Created Yet"
                                    description="Oooh no!...It seems that no ArtWorks created yet 😢"
                                />
                            }
                        >
                            <Grid
                                templateRows="repeat(auto, auto)"
                                templateColumns="repeat(7, 1fr)" 
                                gap={1}
                            >
                                <For each={artworks}>
                                    {(artwork) => (
                                        <ArtworkItem
                                            key={artwork.artworkId}
                                            artwork={artwork}
                                            isOpen={openMenuId === artwork.artworkId}
                                            onMenuToggle={onMenuOpen}
                                            isOwnProfile={isOwnProfile}
                                            isManageMode={isManageMode}
                                            onSelectItem={handleSelectItem}
                                            isSelected={isItemSelected(artwork)}
                                            setOpenModal={setIsModalOpen}
                                        />
                                    )}
                                </For>
                            </Grid>
                        </Show>
                    </Box>
                </Stack>
            </GridItem>

            <WarningDialog
                isOpen={isModalOpen}
                title={"Delete ArtWork"}
                message={`Are you sure you want to delete this ArtWorks?`}
                items={selectedItems}
                onClose={handleCloseDelete}
                onComplete={handleConfirmDelete}
            />
        </>
    );
}

export default ArtistContent;