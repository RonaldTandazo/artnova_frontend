import { Tooltip } from "@/components/ui/tooltip";
import { Box, Button, Flex, For, GridItem, Icon, IconButton, Image, Separator, Show, Stack, Text } from "@chakra-ui/react";
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
    truncatedSummary, 
    onFollow, 
    goSettings 
}: ArtistSidebarProps) => {
    const { colorMode } = useColorMode();
    const [openChat, setOpenChat] = useState<boolean>(false)
    
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
                        p={7}
                        overflowY={"auto"}
                        maxH={"80vh"}
                        maxW={"20vW"}
                    >
                        <Box position="relative" width={"100%"}>
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
                                        '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.600' : 'colors.pink.600',
                                        'color': 'white',
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={onToggleVisible}
                                    borderRadius="full"
                                    colorScheme="black"
                                    size="md"
                                    bg={"transparent"}
                                    color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                    position="absolute"
                                    top="-20px"
                                    left="-20px"
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
                                            '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.600' : 'colors.pink.600',
                                            'color': 'white',
                                        },
                                    }}
                                >
                                    <IconButton
                                        borderRadius="full"
                                        colorScheme="black"
                                        size="md"
                                        bg={"transparent"}
                                        color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                        position="absolute"
                                        top="-20px"
                                        right="-20px"
                                        onClick={goSettings}
                                    >
                                        <FaUserEdit />
                                    </IconButton>
                                </Tooltip>
                            </Show>

                            <Stack>
                                <Box
                                    w="100%"
                                    display={"flex"}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Show
                                        when={userData && userData.avatar}
                                        fallback={
                                            <Icon
                                                as={ImUser}
                                                boxSize="300px"
                                                color={colorMode === 'light' ? 'cyan.100' : 'pink.100'}
                                                bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                                                rounded={'full'}
                                                cursor="pointer"
                                            />
                                        }
                                    >
                                        <Image
                                            src={`${BACKEND_URL}/avatars/${userData?.avatar}`}
                                            alt="Stored Image"
                                            boxSize="300px"
                                            borderRadius="full"
                                            fit="cover"
                                            cursor="pointer"
                                        />
                                    </Show>
                                </Box>

                                <Box
                                    w="100%"
                                    my={5}
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
                                        {userData?.username}
                                    </Text>
                                </Box>

                                <Show
                                    when={!isOwnProfile}
                                >
                                    <Box
                                        w="100%"
                                        my={5}
                                        display={"flex"}
                                        justifyContent="space-evenly"
                                        alignItems="center"
                                    >
                                        <Show
                                            when={!isFollowed}
                                            fallback={
                                                <Button
                                                    bg={colorMode == "light" ? "cyan.100":"pink.100"}
                                                    color={colorMode == "light" ? "cyan.600":"pink.600"}
                                                    disabled={!user}
                                                    onClick={() => onFollow(false)}
                                                >
                                                    <PiUserCheckFill /> Following
                                                </Button>
                                            }
                                        >
                                            <Button
                                                bg={colorMode == "light" ? "cyan.600":"pink.600"}
                                                color={"white"}
                                                disabled={!user}
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
                                                color={colorMode === "light" ? "cyan.600" : "pink.600"}
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