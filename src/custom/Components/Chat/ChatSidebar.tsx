import { useColorMode } from "@/components/ui/color-mode";
import { Box, Center, Flex, For, Icon, List, Show, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsChatFill } from "react-icons/bs";
import Empty from "../States/Empty";
import ChatListItem from "./ChatListItem";
import LoadingProgress from "../States/LoadingProgress";
import { useGetChats } from "@/services/Chat/ChatService";
import { CHAT_LIMIT } from "@/utils/Helpers";
import { ChatSidebarInterface } from "./ChatInterfaces";

const ChatSidebar = ({chats, setChats, selectedChat, onSelectChat, user}: ChatSidebarInterface) => {
    const { colorMode } = useColorMode();
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const{getChatsData, data: chatsData, loading: chatsLoading} = useGetChats()

    const sidebarDisplay = useBreakpointValue({ base: "none", md: "block" });
    const sidebarWidth = { base: "0", md: "25dvw" };

    useEffect(() => {
        if(hasMore){
            getChatsData({limit: CHAT_LIMIT, offset: offset});
        }
    }, [offset]);

    useEffect(() => {
        if(chatsData && chatsData.getChats){
            const newChats = chatsData.getChats;
            
            setChats(prevChats => offset === 0 ? newChats : [...prevChats, ...newChats]);
            setHasMore(newChats.length === CHAT_LIMIT);
        }
    }, [chatsData])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

        const nearBottom = scrollHeight - scrollTop <= clientHeight + 200;

        if (nearBottom && !chatsLoading && hasMore) {
            setOffset(prevOffset => prevOffset + CHAT_LIMIT);
        }
    };

    return (
        <Flex
            h={"full"}
            w={sidebarWidth}
            flexShrink={0}
            direction={"column"}
            borderRight={"1px solid"}
            display={sidebarDisplay}
            borderColor={colorMode == 'light' ? 'cyan.600':"pink.600"}
            bg={colorMode == 'light' ? "whiteAlpha.500":"blackAlpha.500"}
        >
            <Box
                p={5}
                shadow={"md"}
                bg={colorMode == 'light' ? 'cyan.600':"pink.600"}
                flexShrink={0}
            >
                <Flex
                    gap={2}
                    alignItems={"center"}
                    direction={"row"}
                >
                    <Text 
                        fontSize="2xl" 
                        fontWeight="extrabold" 
                    >
                        Chats
                    </Text>
                    <Icon size="md">
                        <BsChatFill /> 
                    </Icon>
                </Flex>
            </Box>

            <VStack
                h={"full"}
                p={3}
                flex={1}
                overflowY={"auto"}
                onScroll={handleScroll}
                alignItems={"stretch"}
                gap={0}
            >    
                <Show when={chatsLoading && chats.length == 0}>
                    <LoadingProgress />
                </Show>

                <Show when={!chatsLoading && chats.length === 0}>
                    <Empty 
                        title={"No Chats to Show"}
                        description={"Contact to an Artist to start a conversation"}
                        default_description={false}
                    />
                </Show>

                <Show
                    when={chats && chats.length > 0}
                >
                    <List.Root 
                        unstyled
                    >
                        <Flex
                            gap={2}
                            direction={"column"}
                        >
                            <For
                                each={chats}
                            >
                                {(chat) => (
                                    <ChatListItem
                                        key={chat.chatId}
                                        chat={chat}
                                        isSelected={selectedChat?.chatId === chat.chatId}
                                        onClick={() => onSelectChat(chat)}
                                        currentUserId={user?.userId}
                                    />
                                )}
                            </For>
                        </Flex>
                    </List.Root>
                </Show>

                <Show when={chatsLoading && chats.length > 0}>
                    <LoadingProgress />
                </Show>

                {/* <Show when={!chatsLoading && !hasMore && chats.length > 0}>
                    <Center py={4}>
                        <Text color="gray.500">No More Chats to Show</Text>
                    </Center>
                </Show> */}
            </VStack>
        </Flex>
    );
}

export default ChatSidebar;