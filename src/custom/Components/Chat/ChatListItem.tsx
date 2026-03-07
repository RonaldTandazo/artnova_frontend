import { Avatar, Box, Flex, HStack, List, Show, Text } from "@chakra-ui/react";
import { ChatListItemInterface } from "./ChatInterfaces";
import { useColorMode } from "@/components/ui/color-mode";
import { BACKEND_URL } from "@/utils/Helpers";

const ChatListItem = ({ chat, isSelected, onClick, currentUserId }: ChatListItemInterface) => {
    const { colorMode } = useColorMode();

    const colors = colorMode === "light"
        ? { selected: "cyan.100", normal: "whiteAlpha.500", border: "cyan.600", text: "cyan.600" }
        : { selected: "pink.100", normal: "blackAlpha.500", border: "pink.600", text: "pink.600" };

    const bgColor = isSelected ? colors.selected : colors.normal;

    const hoverStyle = { 
        cursor: "pointer",
        bg: colors.selected, 
    };

    const isCurrentUser = currentUserId === chat.lastMessage.userId;
    const messagePrefix = isCurrentUser ? "You: " : "";
    const messageContent = chat.lastMessage.message;

    return (
        <List.Item
            p={3}
            bg={bgColor}
            _hover={hoverStyle}
            onClick={onClick}
            borderRadius={4}
            border={"1px solid"}
            borderColor={colors.border}
            transition="background-color 0.1s"
        >
            <HStack align="center">
                <Avatar.Root key={"subtle"} variant={"subtle"}>
                    <Show
                        when={chat.artist.avatar}
                        fallback={
                            <Avatar.Fallback name={chat.artist.username} />
                        }
                    >
                        <Avatar.Image src={`${BACKEND_URL}/avatars/${chat.artist.avatar}`} />
                    </Show>
                </Avatar.Root>

                <Box 
                    w={"full"}
                >
                    <Text 
                        fontWeight={"bold"}
                        color={colors.text}
                    >
                        {chat.artist.username}
                    </Text>

                    <Flex
                        justify="space-between" 
                        align="center" 
                    >
                        <Box
                            flex={1} 
                            minW={0}
                        >
                            <Text
                                fontSize="sm"
                                truncate
                                color={isCurrentUser ? "gray.600" : "gray.500"} 
                            >
                                <Text 
                                    as="span" 
                                    fontWeight="semibold" 
                                    color={isCurrentUser ? colors.border : undefined}
                                >
                                    {messagePrefix}
                                </Text>
                                
                                <Text 
                                    as="span"
                                >
                                    {messageContent}
                                </Text>
                            </Text>
                        </Box>

                        <Box
                            flexShrink={0}
                        >
                            <Text 
                                fontSize="xs" 
                                color={colors.text}
                            >
                                {chat.lastMessage.date}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </HStack>
        </List.Item>
    )
}

export default ChatListItem;