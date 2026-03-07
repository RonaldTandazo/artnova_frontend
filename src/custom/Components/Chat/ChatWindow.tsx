import { useColorMode } from "@/components/ui/color-mode";
import { formatDate } from "@/utils/Helpers";
import { Box, Center, Flex, Icon, IconButton, Input, InputGroup, Show, Spacer, Stack, Text, VStack } from "@chakra-ui/react";
import { BsHandIndexThumbFill } from "react-icons/bs";
import ChatBox from "./ChatBox";
import { ChatWindowInterface, TriggerMessageInterface } from "./ChatInterfaces";
import { useState } from "react";
import { useSetChatMessage } from "@/services/Chat/ChatService";
import { MessageInterface } from "@/graphql/Chat/ChatInterfaces";
import { v4 as uuid } from "uuid";
import { IoMdSend } from "react-icons/io";
import ChatHeader from "./ChatHeader";
import NotificationAlert from "../States/NotificationAlert";
import { Notification } from "@/custom/interfaces/general/GeneralInterfaces";

const ChatWindow = ({selectedChat, user, setChats, setSelectedChat}: ChatWindowInterface) => {
    const { colorMode } = useColorMode();
    const [message, setMessage] = useState<string>("");
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notification, setNotification] = useState<Notification>({message: "", type: undefined});
    const [triggerMessage, setTriggerMessage] = useState<TriggerMessageInterface>({
        state: false,
        newMessage: undefined
    });
        
    const { setChatMessage } = useSetChatMessage();

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !user || !selectedChat) {
            return; 
        }

        const now = new Date();

        const newMessage: MessageInterface = {
            chatId: selectedChat.chatId,
            messageId: uuid(),
            typeMessage: 'text',
            message: trimmedMessage,
            userId: user.userId,
            createdAt: now.toISOString(),
            date: formatDate(now, true, true)
        };

        setTriggerMessage({state: true, newMessage: newMessage})
        setChatMessage({chatId: selectedChat.chatId, artistId: selectedChat.artist.artistId, message: newMessage})
        setMessage("");
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleShowNotification = (dataNotification: Notification) => {
        setNotification(dataNotification);
        setShowNotification(true);
    }

    return (
        <Flex
            w={"full"} 
            h={"full"}
            direction="column"
        >
            <Show
                when={selectedChat}
                fallback={
                    <Center 
                        p={10}
                        flex={1} 
                        textAlign="center" 
                        bg={colorMode == 'light' ? "whiteAlpha.500":"blackAlpha.500"}
                        color={colorMode == 'light' ? "cyan.600":"pink.600"}
                    >
                        <VStack>
                            <Icon size={"2xl"}>
                                <BsHandIndexThumbFill />
                            </Icon>
                            
                            <Text 
                                fontSize="xl"
                                fontWeight="medium"
                                color={colorMode === "light" ? "black":"white"}
                            >
                                Select a chat from the list to start a conversation
                            </Text>
                        </VStack>
                    </Center>
                }
            >
                <Stack
                    h={"full"}
                >
                    <ChatHeader
                        selectedChat={selectedChat}
                        user={user}
                        setChats={setChats} 
                        setSelectedChat={setSelectedChat}
                        onShowMessage={handleShowNotification}
                    />

                    <ChatBox
                        key={selectedChat?.chatId}
                        openChat={selectedChat ? true:false}
                        chatId={selectedChat?.chatId}
                        user={user}
                        triggerMessage={triggerMessage}
                        onToggleNewMessage={() => {
                            setTriggerMessage({
                                state: false,
                                newMessage: undefined
                            })
                        }}
                        setChats={setChats}
                    />

                    
                    <Box
                        p={3}
                        borderTop="1px solid" 
                        borderColor={colorMode == 'light' ? 'cyan.600':"pink.600"}
                        bg={colorMode == 'light' ? "whiteAlpha.500":"blackAlpha.500"}
                    >
                        <Show
                            when={!selectedChat?.isBlocked && !selectedChat?.hasBlockedMe}
                            fallback={
                                <Center>
                                    <Text>Can't Send Messages to this User</Text>
                                </Center>
                            }
                        >
                            <InputGroup
                                w={"98%"}
                                endElement={
                                    <IconButton 
                                        bg={"transparent"}
                                        color={colorMode == "light" ? "cyan.600":"pink.600"}
                                        rounded={"full"}
                                        disabled={!user || message.trim() === ""}
                                        size={"sm"}
                                        onClick={handleSendMessage}
                                    >
                                        <IoMdSend />
                                    </IconButton>
                                }
                            >
                                <Input
                                    value={message}
                                    placeholder="Type your message..."
                                    color={colorMode === "light" ? "black" : "white"}
                                    borderColor={colorMode === "light" ? "cyan.600" : "pink.600"}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </InputGroup>
                        </Show>
                    </Box>
                </Stack>
            </Show>

            <Show
                when={showNotification && notification.message != ""}
            >
                <NotificationAlert
                    type={notification.type}
                    title="Chats"
                    message={notification.message}
                    onClose={() => {
                        setNotification({message: "", type: undefined})
                        setShowNotification(false);
                    }}
                />
            </Show>
        </Flex>
    );
}

export default ChatWindow;