import { useColorMode } from "@/components/ui/color-mode"
import { useSetFollowState, useUnsetFollowState } from "@/services/Follow/FollowService"
import { BACKEND_URL, encodeToBase64 } from "@/utils/Helpers"
import { Avatar, Flex, Icon, Link, Menu, Portal, Show, Spacer, Text } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdBlock, MdDelete } from "react-icons/md"
import { PiUserMinusFill, PiUserPlusFill } from "react-icons/pi"
import { CgUnblock } from "react-icons/cg";
import { ChatHeaderInterface } from "./ChatInterfaces"
import { useDeleteChat } from "@/services/Chat/ChatService"
import { useSetBlockState, useUnsetBlockState } from "@/services/Block/BlockService"

const ChatHeader = ({selectedChat, user, setChats, setSelectedChat, onShowMessage}: ChatHeaderInterface) => {
    const { colorMode } = useColorMode();
    const { setFollowState } = useSetFollowState();
    const { unsetFollowState } = useUnsetFollowState();
    const { setBlockState } = useSetBlockState();
    const { unsetBlockState } = useUnsetBlockState();
    const { deleteChat } = useDeleteChat();

    const handleNavigateProfile = (userId: number) => {
        const isOwn = user && userId === user.userId;
        const encodedUserId = encodeToBase64(userId);
        const encodedModule = encodeToBase64(isOwn ? 'OwnProfile' : 'VisitProfile');

        return `/Profile/${encodedUserId}/${encodedModule}`
    }

    const handleFollowState = (state: boolean) => {
        const data = {
            followedId: selectedChat!.artist.artistId
        }

        setChats(prev => prev.map((c) => {
            if (c.chatId == selectedChat!.chatId) {
                return { ...c, isFollowing: state };
            }

            return c;
        }));

        setSelectedChat(prev => {
            if (prev?.chatId === selectedChat!.chatId) {
                return { ...prev, isFollowing: state };
            }
            return prev;
        });
    
        state ? setFollowState(data) : unsetFollowState(data)
    }

    const handleBlockUser = async (state: boolean) => {  
        const data = {
            blockedId: selectedChat!.artist.artistId
        }

        setChats(prev => prev.map((c) => {
            if (c.chatId == selectedChat!.chatId) {
                return { ...c, isBlocked: state, isFollowing: false };
            }

            return c;
        }));

        setSelectedChat(prev => {
            if (prev?.chatId === selectedChat!.chatId) {
                return { ...prev, isBlocked: state, isFollowing: false };
            }
            return prev;
        });

        try {
            if (state) {
                const { data: resData } = await setBlockState(data);
                if (resData) {
                    onShowMessage({
                        message: resData.setBlockState,
                        type: "success"
                    });
                }

                handleFollowState(!state)
            } else {
                const { data: resData } = await unsetBlockState(data);
                if (resData) {
                    onShowMessage({
                        message: resData.unsetBlockState,
                        type: "success"
                    });
                }
            }
        } catch (error) {
            onShowMessage({ message: `Error ${state ? 'Blocking':'Unblocking'} User`, type: "error" });
        }
    }

    const handleDeleteChat = async () => {  
        try {
            const response = await deleteChat({chatId: selectedChat!.chatId});
            if(response?.data?.deleteChat){
                setChats(prev => prev.filter(c => c.chatId != selectedChat!.chatId));
                onShowMessage({ 
                    message: response.data.deleteChat, 
                    type: "success" 
                });
                setSelectedChat(undefined);
            }
        } catch (error) {
            onShowMessage({ message: "Error Deleting Chat", type: "error" });
        }
    }

    return (
        <Flex
            p={4.5}
            gap={3}
            shadow={"md"}
            alignItems={"center"}
            bg={colorMode == 'light' ? 'cyan.50':"pink.50"}
        >
            <Avatar.Root key={"subtle"} variant={"subtle"}>
                <Show
                    when={selectedChat?.artist.avatar}
                    fallback={
                        <Avatar.Fallback name={selectedChat?.artist.username} />
                    }
                >
                    <Avatar.Image src={`${BACKEND_URL}/avatars/${selectedChat?.artist.avatar}`} />
                </Show>
            </Avatar.Root>

            <Link 
                variant="plain" 
                href={
                    (!selectedChat?.isBlocked && !selectedChat?.hasBlockedMe) ? handleNavigateProfile(selectedChat!.artist!.artistId):'#'
                } 
                color={colorMode == "light" ? "cyan.600":"pink.600"}
            >
                <Text 
                    fontSize="2xl" 
                    fontWeight="bold"
                    color={colorMode == 'light' ? "cyan.600":"pink.600"}
                >
                    {selectedChat?.artist.username}
                </Text>
            </Link>

            <Spacer />

            <Menu.Root lazyMount>
                <Menu.Trigger asChild>
                    <Icon
                        color={colorMode == "light" ? "cyan.600":"pink.600"}
                        size={"lg"}
                        cursor={"pointer"}
                    >
                        <BsThreeDotsVertical />
                    </Icon>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content zIndex={"toast"}>
                            <Show
                                when={!selectedChat!.isBlocked && !selectedChat!.hasBlockedMe}
                            >
                                <Menu.Item 
                                    value="follow-user"
                                    cursor={"pointer"}
                                    onClick={() => handleFollowState(!selectedChat!.isFollowing)}
                                >
                                    <Show
                                        when={!selectedChat!.isFollowing}
                                        fallback={
                                            <>
                                                <PiUserMinusFill /> Unfollow
                                            </>
                                        }
                                    >
                                        <PiUserPlusFill /> Follow
                                    </Show>
                                </Menu.Item>
                            </Show>
                            <Show
                                when={!selectedChat!.hasBlockedMe}
                            >
                                <Menu.Item 
                                    value="block-user"
                                    cursor={"pointer"}
                                    color="fg.error"
                                    _hover={{ bg: "bg.error", color: "fg.error" }}
                                    onClick={() => handleBlockUser(!selectedChat!?.isBlocked)}
                                >
                                    <Show
                                        when={!selectedChat!?.isBlocked}
                                        fallback={
                                            <>
                                                <CgUnblock /> Unblock User
                                            </>
                                        }
                                    >
                                        <MdBlock /> Block User
                                    </Show>
                                </Menu.Item>
                            </Show>
                            <Menu.Item 
                                value="delete-chat"
                                cursor={"pointer"}
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                                onClick={handleDeleteChat}
                            >
                                <MdDelete /> Delete Chat
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex>
    )
}

export default ChatHeader;