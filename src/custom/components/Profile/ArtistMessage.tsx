import { useColorMode } from "@/components/ui/color-mode"
import { Avatar, Box, Button, CloseButton, Drawer, IconButton, Input, InputGroup, Portal, Text } from "@chakra-ui/react"
import { IoMdChatbubbles, IoMdSend } from "react-icons/io"
import { BACKEND_URL, formatDate } from "@/utils/Helpers";
import { useEffect, useState } from "react";
import { useSetChatMessage } from "@/services/Chat/ChatService";
import { MessageInterface } from "@/graphql/Chat/ChatInterfaces";
import { v4 as uuid } from "uuid";
import ChatBox from "../Chat/ChatBox";
import { TriggerMessageInterface } from "../Chat/ChatInterfaces";
import { ArtistMessageProps } from "@/custom/interfaces/Profile/ArtistMessage";

const ArtistMessage = ({ artist, user, openChat, onToggleChat }: ArtistMessageProps) => {
    const { colorMode } = useColorMode();
    const [chatId, setChatId] = useState<string | undefined>(artist?.chatId);
    const [message, setMessage] = useState<string>("");
    const [triggerMessage, setTriggerMessage] = useState<TriggerMessageInterface>({
        state: false,
        newMessage: undefined
    });

    const {setChatMessage, data: setChatMessageData} = useSetChatMessage();

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !user || !artist) {
            return; 
        }

        const now = new Date();

        const newMessage: MessageInterface = {
            chatId: chatId,
            messageId: uuid(),
            typeMessage: 'text',
            message: trimmedMessage,
            userId: user.userId,
            createdAt: now.toISOString(),
            date: formatDate(now, true, true)
        };

        setTriggerMessage({state: true, newMessage: newMessage})
        setChatMessage({chatId: chatId, artistId: artist.userId, message: newMessage})
        setMessage("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if(!chatId && setChatMessageData && setChatMessageData.setChatMessage){
            setChatId(setChatMessageData.setChatMessage.chatId)
        }
    }, [setChatMessageData, chatId])

    return (
        <Drawer.Root open={openChat} onOpenChange={onToggleChat} placement={"start"} size={"xl"}>
            <Drawer.Trigger asChild>
                <Button
                    size={"xs"}
                    disabled={!user}
                    bg={colorMode == "light" ? "black":"white"}
                >
                    <IoMdChatbubbles /> Message
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header
                            color={'white'}
                            bg={colorMode == 'light' ? 'teal.400':'pink.600'}
                        >
                            <Drawer.Title>
                                <Box 
                                    display={"flex"} 
                                    flexDirection={"row"} 
                                    alignItems={"center"} 
                                    justifyContent={"flex-start"}
                                    gap={3}
                                >
                                    <Avatar.Root key={"subtle"} variant={"subtle"}>
                                        <Avatar.Fallback name={ artist?.username } />
                                        <Avatar.Image src={`${BACKEND_URL}/avatars/${artist?.avatar}`} />
                                    </Avatar.Root>
                                    <Text fontSize={20}>{ artist?.username }</Text>    
                                </Box>
                            </Drawer.Title>
                        </Drawer.Header>

                        <Drawer.Body
                            display="flex" 
                            flexDirection="column"
                        >
                            <ChatBox 
                                openChat={openChat}
                                chatId={chatId}
                                user={user}
                                triggerMessage={triggerMessage}
                                onToggleNewMessage={() => {
                                    setTriggerMessage({
                                        state: false,
                                        newMessage: undefined
                                    })
                                }}
                                setChats={undefined}
                            />
                        </Drawer.Body>
                        
                        <Drawer.Footer
                            display="flex" 
                            padding={5}
                            bg={colorMode === "light" ? "gray.50" : "blackAlpha.600"} 
                            borderTopWidth="1px"
                            borderColor={colorMode === "light" ? "gray.200" : "blackAlpha.800"}

                        >
                            <InputGroup 
                                endElement={
                                    <IconButton 
                                        bg={"transparent"}
                                        color={colorMode == "light" ? "teal.400":"pink.600"}
                                        rounded={"full"}
                                        disabled={!user || message.trim() === ""}
                                        size={"xs"}
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
                                    borderColor={colorMode === "light" ? "teal.400" : "pink.600"}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </InputGroup>
                        </Drawer.Footer>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton 
                                size="sm"
                                bg={colorMode == 'light' ? 'white':'black'}
                                color={colorMode == 'light' ? 'teal.400':'white'}
                                borderColor={colorMode == 'light' ? 'teal.400':'white'} 
                            />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default ArtistMessage;