import { Box, Button, Flex, For, Grid, GridItem, Heading, Show, Spacer, Stack, } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import Empty from "../States/Empty";
import ArtworkItem from "../Artwork/ArtworkItem";
import { FaPaintBrush } from "react-icons/fa";
import { ArtistContentProps } from "@/custom/interfaces/Profile/ArtistContent";

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
                        </Show>
                    </Flex>
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
                                            onDelete={onDelete}
                                        />
                                    )}
                                </For>
                            </Grid>
                        </Show>
                    </Box>
                </Stack>
            </GridItem>
        </>
    );
}

export default ArtistContent;