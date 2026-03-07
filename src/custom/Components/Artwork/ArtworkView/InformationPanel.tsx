import { BACKEND_URL } from "@/utils/Helpers";
import { Avatar, Box, For, Grid, Heading, HStack, Icon, Image, Link, Show, Spacer, Stack, Stat, Text } from "@chakra-ui/react";
import { BiDislike, BiLike, BiSolidCategory, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useColorMode } from "@/components/ui/color-mode";
import { IoEye } from "react-icons/io5";
import { FaComments } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { MdHideImage, MdTopic } from "react-icons/md";
import { FaBookmark, FaMicrochip, FaRegBookmark } from "react-icons/fa6";
import { InformationPanelProps, OnDislikeData, OnFavoritesData, OnLikeData } from "@/custom/interfaces/ArtworkView/InformationPanel";

const InformationPanel = ({user, artworkData, artworkStatistics, onLike, onDisLike, onFavorites, toProfile, checkAuthentication}: InformationPanelProps) => {
    const { colorMode } = useColorMode();

    const handleLikes = () => {
        if(user && artworkData && artworkStatistics){
            const currentUserId = user.userId;
            const userIndex = artworkStatistics.likes.findIndex((userId: number) => userId === currentUserId);
            let newLikesArray = [];

            if (userIndex === -1) {
                newLikesArray = [...artworkStatistics.likes, currentUserId];
            } else {
                newLikesArray = [
                    ...artworkStatistics.likes.slice(0, userIndex),
                    ...artworkStatistics.likes.slice(userIndex + 1)
                ];
            }

            const data: OnLikeData = {
                artworkId: artworkData?.artworkId,
                likes: newLikesArray
            }

            onLike(newLikesArray, data)
        }else{
            checkAuthentication();
        }
    }

    const handleDisLikes = () => {
        if(user && artworkData && artworkStatistics){
            const currentUserId = user.userId;
            const userIndex = artworkStatistics.dislikes.findIndex((userId: number) => userId === currentUserId);
            let newDisLikesArray = [];

            if (userIndex === -1) {
                newDisLikesArray = [...artworkStatistics.dislikes, currentUserId];
            } else {
                newDisLikesArray = [
                    ...artworkStatistics.dislikes.slice(0, userIndex),
                    ...artworkStatistics.dislikes.slice(userIndex + 1)
                ];
            }

            const data: OnDislikeData = {
                artworkId: artworkData?.artworkId,
                dislikes: newDisLikesArray
            }

            onDisLike(newDisLikesArray, data)
        }else{
            checkAuthentication();
        }
    }

    const handleFavorites = () => {
        if(user && artworkData && artworkStatistics){
            const currentUserId = user.userId;
            const userIndex = artworkStatistics.favorites.findIndex((userId: number) => userId === currentUserId);
            let newFavoritesArray = [];

            if (userIndex === -1) {
                newFavoritesArray = [...artworkStatistics.favorites, currentUserId];
            } else {
                newFavoritesArray = [
                    ...artworkStatistics.favorites.slice(0, userIndex),
                    ...artworkStatistics.favorites.slice(userIndex + 1)
                ];
            }

            const data: OnFavoritesData = {
                artworkId: artworkData?.artworkId,
                favorites: newFavoritesArray
            }

            onFavorites(newFavoritesArray, data)
        }else{
            checkAuthentication();
        }
    }

    return (
        <Box
            p={5}
            position="sticky"
            h="auto"
            top="100px"
            maxH={"1500px"}
            overflowY="auto"
            bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
            borderRadius="sm"
            display={"flex"}
            flexDirection={"column"}
            gap={15}
        >
            <Stack
                p={5}
                h="auto"
                shadow={"md"}
                borderRadius={4}
                direction={"column"}
            >
                <Show
                    when={artworkData?.thumbnail && artworkData?.thumbnail != ''}
                    fallback={
                        <Box
                            w={"full"}
                            h={"433px"}
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                            color={'whiteAlpha.950'}
                        >
                            <Icon
                                as={MdHideImage}
                                cursor="pointer"
                                size={"2xl"}
                            />
                        </Box>
                    }
                >
                    <Image 
                        src={`${BACKEND_URL}/thumbnails/${artworkData?.thumbnail}`}
                    />
                </Show>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Heading size={"4xl"}>{artworkData?.title}</Heading>
                </Box>
                <Show
                    when={artworkData?.description && artworkData?.description != ''}
                >
                    <Stack direction={"column"}>
                        <Text fontSize={14} fontStyle={'italic'}>Description</Text>
                        <Text>
                            {artworkData?.description}
                        </Text>
                    </Stack>
                </Show>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                    <Stack direction={"row"} h={"full"}>
                        <Show
                            when={!user || (user && !artworkStatistics?.likes.includes(user.userId) && !artworkStatistics?.dislikes.includes(user?.userId))}
                        >
                            <BiLike
                                onClick={handleLikes} 
                                cursor={"pointer"} 
                                color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                size={25}
                            />

                            <BiDislike 
                                onClick={handleDisLikes}
                                cursor={"pointer"}
                                color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                size={25}
                            />
                        </Show>

                        <Show
                            when={user && artworkStatistics?.likes.includes(user?.userId)}
                        >
                            <BiSolidLike
                                onClick={handleLikes} 
                                cursor={"pointer"} 
                                color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                size={25}
                            />
                        </Show>
                        
                        <Show
                            when={user && artworkStatistics?.dislikes.includes(user?.userId)}
                        >
                            <BiSolidDislike 
                                onClick={handleDisLikes}
                                cursor={"pointer"} 
                                color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                size={25}
                            />
                        </Show>
                        
                        <Show
                            when={user && artworkStatistics?.favorites?.includes(user?.userId)}
                            fallback={
                                <FaRegBookmark
                                    onClick={handleFavorites}
                                    cursor={"pointer"}
                                    color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                    size={25}
                                />
                            }
                        >
                            <FaBookmark
                                onClick={handleFavorites}
                                cursor={"pointer"} 
                                color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                size={25}
                            />
                        </Show>
                    </Stack>

                    <Spacer />
                    
                    <Stack direction={"row"}>
                        <Link
                            variant="plain" 
                            href={toProfile(artworkData?.owner.userId)} 
                            color={colorMode == "light" ? "cyan.600":"pink.600"}
                        >
                            <Avatar.Root key={"subtle"} variant={"subtle"}>
                                <Avatar.Fallback name={artworkData?.owner.username} />
                                <Avatar.Image src={`${BACKEND_URL}/avatars/${artworkData?.owner.avatar}`} />
                            </Avatar.Root>
                        </Link>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"} justifyContent={"center"}>
                            <Link
                                variant="plain" 
                                href={toProfile(artworkData?.owner.userId)} 
                                color={colorMode == "light" ? "cyan.600":"pink.600"}
                            >
                                {artworkData?.owner.username}
                            </Link>
                            <Text fontSize={14} fontStyle={'italic'}>Author</Text>    
                        </Box>
                    </Stack>
                </Box>
            </Stack>

            <Stack
                p={5}
                h="auto"
                shadow={"md"}
                borderRadius={4}
                direction={"column"}
            >
                <HStack>
                    <Icon color="fg.muted">
                        <IoIosStats />
                    </Icon>
                    <Text
                        fontSize={14}
                    >
                        Stats
                    </Text>
                </HStack>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Show
                        when={artworkStatistics}
                        fallback={
                            <Text>
                                No Stats Yet
                            </Text>
                        }
                    >
                        <Grid
                            templateRows={"repeat(auto, auto)"}
                            templateColumns={"repeat(2, 1fr)"}
                            w={"full"}
                            gap={3}
                        >
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                                <Stat.Root>
                                    <HStack justify="space-between">
                                        <Stat.Label>Views</Stat.Label>
                                        <Icon color="fg.muted">
                                            <IoEye />
                                        </Icon>
                                    </HStack>
                                    <Stat.ValueText>{artworkStatistics?.viewsAmount}</Stat.ValueText>
                                </Stat.Root>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                                <Stat.Root>
                                    <HStack justify="space-between">
                                        <Stat.Label>Likes</Stat.Label>
                                        <Icon color="fg.muted">
                                            <BiSolidLike />
                                        </Icon>
                                    </HStack>
                                    <Stat.ValueText>
                                        {artworkStatistics?.likes.length}
                                    </Stat.ValueText>
                                </Stat.Root>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                                <Stat.Root>
                                    <HStack justify="space-between">
                                        <Stat.Label>Dislikes</Stat.Label>
                                        <Icon color="fg.muted">
                                            <BiSolidDislike />
                                        </Icon>
                                    </HStack>
                                    <Stat.ValueText>
                                        {artworkStatistics?.dislikes.length}
                                    </Stat.ValueText>
                                </Stat.Root>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                                <Stat.Root>
                                    <HStack justify="space-between">
                                        <Stat.Label>Comments</Stat.Label>
                                        <Icon color="fg.muted">
                                            <FaComments />
                                        </Icon>
                                    </HStack>
                                    <Stat.ValueText>
                                        {artworkStatistics?.commentsAmount}
                                    </Stat.ValueText>
                                </Stat.Root>
                            </Box>
                        </Grid>
                    </Show>
                </Box>
            </Stack>

            <Stack
                p={5}
                h="auto"
                shadow={"md"}
                borderRadius={4}
                direction={"column"}
            >
                <HStack>
                    <Icon color="fg.muted">
                        <BiSolidCategory />
                    </Icon>
                    <Text
                        fontSize={14}
                    >
                        Categories
                    </Text>
                </HStack>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Show
                        when={artworkData?.categories && artworkData?.categories.length > 0}
                        fallback={
                            <Text>
                                No Categories Assigned Yet
                            </Text>
                        }
                    >
                        <Grid
                            templateRows={"repeat(auto, auto)"}
                            templateColumns={"repeat(2, 1fr)"}
                            w={"full"}
                            gap={2}
                        >
                            <For each={artworkData?.categories}>
                                {(category) => (
                                    <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} key={category.value}>
                                        <VscDebugBreakpointLog /> {category.label}
                                    </Box>
                                )}
                            </For>
                        </Grid>
                    </Show>
                </Box>
            </Stack>

            <Stack
                p={5}
                h="auto"
                shadow={"md"}
                borderRadius={4}
                direction={"column"}
            >
                <HStack>
                    <Icon color="fg.muted">
                        <MdTopic />
                    </Icon>
                    <Text
                        fontSize={14}
                    >
                        Topics
                    </Text>
                </HStack>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Show
                        when={artworkData?.topics && artworkData?.topics.length > 0}
                        fallback={
                            <Text>
                                No Topics Assigned Yet
                            </Text>
                        }
                    >
                        <Grid
                            templateRows="repeat(auto, auto)"
                            templateColumns={"repeat(2, 1fr)"}
                            w={"full"}
                            gap={2}
                        >
                            <For each={artworkData?.topics}>
                                {(topic) => (
                                    <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} key={topic.value}>
                                        <VscDebugBreakpointLog /> {topic.label}
                                    </Box>
                                )}
                            </For>
                        </Grid>
                    </Show>
                </Box>
            </Stack>

            <Stack
                p={5}
                h="auto"
                shadow={"md"}
                borderRadius={4}
                direction={"column"}
            >
                <HStack>
                    <Icon color="fg.muted">
                        <FaMicrochip />
                    </Icon>
                    <Text
                        fontSize={14}
                    >
                        Softwares
                    </Text>
                </HStack>
                <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Show
                        when={artworkData?.softwares && artworkData?.softwares.length > 0}
                        fallback={
                            <Text>
                                No Softwares Assigned Yet
                            </Text>
                        }
                    >
                        <Grid
                            templateRows="repeat(auto, auto)"
                            templateColumns={"repeat(2, 1fr)"}
                            w={"full"}
                            gap={2}
                        >
                            <For each={artworkData?.softwares}>
                                {(software) => (
                                    <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} key={software.value}>
                                        <VscDebugBreakpointLog /> {software.label}
                                    </Box>
                                )}
                            </For>
                        </Grid>
                    </Show>
                </Box>
            </Stack>
        </Box>
    )
}

export default InformationPanel;