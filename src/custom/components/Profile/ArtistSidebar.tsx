import { Tooltip } from "@/components/ui/tooltip";
import { Box, Button, Flex, For, GridItem, HStack, Icon, IconButton, Image, Separator, Show, Stack, Stat, Text } from "@chakra-ui/react";
import { BsGlobe2 } from "react-icons/bs";
import { IoEyeOff } from "react-icons/io5";
import { PiUserCheckFill, PiUserPlusFill } from "react-icons/pi";
import IconsSocialMedia from "../SocialMedia/IconsSocialMedia";
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode } from "@/components/ui/color-mode";
import { BACKEND_URL } from "@/utils/Helpers";
import { ImUser } from "react-icons/im";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import ArtistMessage from "./ArtistMessage";
import { ArtistSidebarProps } from "@/custom/interfaces/Profile/ArtistSidebar";

const ArtistSidebar = ({ 
    isSummaryExpanded, 
    onToggleSummary, 
    isUserInfoVisible, 
    onToggleVisible, 
    isOwnProfile, 
    userSocialMedia, 
    shouldExpand, 
    userData, 
    isFollowed, 
    user,
    userStats,
    truncatedSummary, 
    onFollow, 
    goSettings 
}: ArtistSidebarProps) => {
    const { colorMode } = useColorMode();
    const [openChat, setOpenChat] = useState<boolean>(false)
    
    const coverUrl = userData?.cover 
        ? `${BACKEND_URL}/covers/${userData.cover}` 
        : null;

    return (
        <AnimatePresence>
            <Show
                when={isUserInfoVisible}
            >
                <motion.div
                    key="userInfo"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%", transition: { duration: 0.3 } }}
                    transition={{ duration: 0.3 }}
                    style={{ gridColumn: "1 / 2" }}
                >
                    <GridItem
                        bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
                        rounded={"lg"}
                        shadow={"lg"}
                        overflow={"hidden"}
                        maxH={"80vh"}
                        maxW={"20vW"}
                    >
                        <Box 
                            h="150px" 
                            w="100%" 
                            position="relative"
                            background={coverUrl 
                                ? `url(${coverUrl}) center/cover no-repeat` 
                                : "none"
                            }
                            bgGradient={!coverUrl ? "to-br" : undefined}
                            gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                            gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                            backgroundColor={!coverUrl 
                                ? (colorMode === 'light' ? 'teal.400' : 'pink.600') 
                                : "transparent"
                            }
                        />

                        <Box 
                            p={7}
                            mt="-60px"
                            position="relative"
                        >
                            <Flex 
                                justify="space-between"
                                position="absolute"
                                top="-80px"
                                left="15px"
                                right="15px"
                                pointerEvents="none"
                            >
                                <Tooltip
                                    content="Hide Profile"
                                    openDelay={500}
                                    closeDelay={100}
                                    unmountOnExit={true}
                                    lazyMount={true}
                                    positioning={{ placement: 'top' }}
                                    showArrow
                                    contentProps={{
                                        css: {
                                            '--tooltip-bg': colorMode === 'light' ? 'colors.teal.400' : 'colors.pink.600',
                                            'color': 'white',
                                        },
                                    }}
                                >
                                    <IconButton
                                        onClick={onToggleVisible}
                                        borderRadius="full"
                                        size="sm"
                                        bg="blackAlpha.600"
                                        _hover={{ bg: "blackAlpha.800" }}
                                        color="white"
                                        pointerEvents="auto"
                                    >
                                        <IoEyeOff />
                                    </IconButton>
                                </Tooltip>

                                <Show
                                    when={isOwnProfile}
                                >
                                    <Tooltip
                                        content="Edit Profile"
                                        openDelay={500}
                                        closeDelay={100}
                                        unmountOnExit={true}
                                        lazyMount={true}
                                        positioning={{ placement: 'top' }}
                                        showArrow
                                        contentProps={{
                                            css: {
                                                '--tooltip-bg': colorMode === 'light' ? 'colors.teal.400' : 'colors.pink.600',
                                                'color': 'white',
                                            },
                                        }}
                                    >
                                        <IconButton
                                            onClick={goSettings}
                                            borderRadius="full"
                                            size="sm"
                                            bg="blackAlpha.600"
                                            _hover={{ bg: "blackAlpha.800" }}
                                            color="white"
                                            pointerEvents="auto"
                                        >
                                            <FaUserEdit />
                                        </IconButton>
                                    </Tooltip>
                                </Show>
                            </Flex>

                            <Stack>
                                <Box
                                    w="100%"
                                    display={"flex"}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Box 
                                        borderRadius="full" 
                                        shadow="md"
                                    >
                                        <Show
                                            when={userData && userData.avatar}
                                            fallback={
                                                <Icon
                                                    as={ImUser}
                                                    boxSize="200px"
                                                    color={colorMode === 'light' ? 'teal.100' : 'pink.100'}
                                                    bgGradient={"to-br"}
                                                    gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                                                    gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                                                    rounded={'full'}
                                                />
                                            }
                                        >
                                            <Image
                                                src={`${BACKEND_URL}/avatars/${userData?.avatar}`}
                                                alt="Artist Avatar"
                                                boxSize="200px"
                                                borderRadius="full"
                                                fit="cover"
                                                border="4px solid"
                                                borderColor={colorMode === 'light' ? 'teal.400' : 'pink.600'}
                                            />
                                        </Show>
                                    </Box>
                                </Box>

                                <Box
                                    w="100%"
                                    mt={2}
                                >
                                    <Text
                                        fontSize={"3xl"} 
                                        justifySelf={"center"} 
                                        textAlign={"center"} 
                                        fontWeight={"extrabold"}
                                    >
                                        {userData?.firstName} {userData?.lastName}
                                    </Text>
                                    
                                    <Text 
                                        fontSize={"xl"} 
                                        justifySelf={"center"} 
                                        textAlign={"center"}
                                    >
                                        @{userData?.username}
                                    </Text>
                                </Box>

                                <HStack 
                                    my={3}
                                >
                                    <Stat.Root 
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                    >
                                        <Stat.ValueText>{userStats?.followersCount}</Stat.ValueText>
                                        <Stat.Label>
                                            Followers
                                        </Stat.Label>
                                    </Stat.Root>

                                    <Stat.Root
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                    >
                                        <Stat.ValueText>{userStats?.followingCount}</Stat.ValueText>
                                        <Stat.Label>
                                            Following
                                        </Stat.Label>
                                    </Stat.Root>
                                </HStack>

                                <Show
                                    when={!isOwnProfile}
                                >
                                    <Box
                                        w="100%"
                                        my={2}
                                        display={"flex"}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                    >
                                        <Show
                                            when={!isFollowed}
                                            fallback={
                                                <Button
                                                    size={"xs"}
                                                    disabled={!user}
                                                    bg={colorMode == "light" ? "teal.100":"pink.100"}
                                                    color={colorMode == "light" ? "teal.400":"pink.600"}
                                                    onClick={() => onFollow(false)}
                                                >
                                                    <PiUserCheckFill /> Following
                                                </Button>
                                            }
                                        >
                                            <Button
                                                size={"xs"}
                                                color={"white"}
                                                disabled={!user}
                                                bg={colorMode == "light" ? "teal.400":"pink.600"}
                                                onClick={() => onFollow(true)}
                                            >
                                                <PiUserPlusFill /> Follow
                                            </Button>
                                        </Show>
                                        
                                        <ArtistMessage
                                            artist={userData}
                                            user={user}
                                            openChat={openChat}
                                            onToggleChat={() => setOpenChat(!openChat)}
                                        />
                                    </Box>
                                    <Show
                                        when={!isOwnProfile && !user}
                                    >
                                        <Text>
                                            You must log in to Follow or Chat with an Artist
                                        </Text>
                                    </Show>
                                </Show>
                                
                                <Show when={userData && userData?.professionalHeadline && userData.professionalHeadline !== ''}>
                                    <Box>
                                        <Text fontSize={"md"} justifySelf={"start"} textAlign={"justify"}>{userData?.professionalHeadline}</Text>
                                    </Box>
                                </Show>
                                
                                <Stack my={5} w="100%" gap={2}>
                                    {/* <Show when={user?.email && user.email !== ''}>
                                        <Flex align="center" visibility={user?.email}>
                                            <MdEmail />
                                            <Text fontSize={"md"} ml={2}>
                                                {user?.email}
                                            </Text>
                                        </Flex>
                                    </Show> */}
                                    <Show when={userData?.location && userData.location !== ''}>
                                        <Flex align="center" >
                                            <BsGlobe2 />
                                            <Text fontSize={"md"} ml={2}>
                                                {userData?.location}
                                            </Text>
                                        </Flex>
                                    </Show>
                                    {/* <Show when={user?.telephone && user.telephone !== ''}>
                                        <Flex align="center" >
                                            <BsTelephoneFill />
                                            <Text fontSize={"md"} ml={2}>
                                                {user?.telephone}
                                            </Text>
                                        </Flex>
                                    </Show> */}
                                </Stack>
                                <Show when={userData?.summary && userData.summary !== ''}>
                                    <Separator variant={"solid"} style={{ color: "white" }} />
                                    
                                    <Box w="100%" mt={2} mb={5}>
                                        <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Summary</Text>
                                        <Text textAlign={"justify"}>{truncatedSummary}</Text>
                                        <Show when={shouldExpand}>
                                            <Text
                                                mt={2}
                                                cursor="pointer"
                                                textDecoration="none"
                                                _hover={{ textDecoration: "underline" }}
                                                color={colorMode === "light" ? "teal.400" : "pink.600"}
                                                onClick={onToggleSummary}
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <span style={{ marginRight: '5px' }}>
                                                    {isSummaryExpanded ? "Show Less" : "Show More"}
                                                </span>
                                                <Show 
                                                    when={isSummaryExpanded} 
                                                    fallback={
                                                        <span>
                                                            <SlArrowDown />
                                                        </span>
                                                    }
                                                >
                                                    <span>
                                                        <SlArrowUp />
                                                    </span>
                                                </Show>
                                            </Text>
                                        </Show>
                                    </Box>
                                </Show>
                                <Show when={userSocialMedia && userSocialMedia.length > 0}>
                                    <Separator variant={"solid"} style={{ color: "white" }} />
                                    <Box w="100%" mt={2}>
                                        <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Social Media</Text>
                                        <Flex 
                                            gap={4}
                                            display="grid" 
                                            gridTemplateColumns="repeat(12, 1fr)"
                                            gridAutoRows="auto"
                                        >
                                            <For
                                                each={userSocialMedia}
                                            >
                                                {(item) => {
                                                    return (
                                                        <IconsSocialMedia 
                                                            key={item.userSocialNetworkId}
                                                            socialNetwork={item.network}
                                                            link={item.link}
                                                            size={'lg'}
                                                        />
                                                    )
                                                }}
                                            </For>
                                        </Flex>
                                    </Box>
                                </Show>
                            </Stack>
                        </Box>
                    </GridItem>
                </motion.div>
            </Show>
        </AnimatePresence>
    );
}

export default ArtistSidebar;