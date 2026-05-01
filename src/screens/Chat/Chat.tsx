import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { ChatItemInterface } from "@/graphql/Chat/ChatInterfaces";
import { useState } from "react";
import ChatSidebar from "@/custom/components/Chat/ChatSidebar";
import ChatWindow from "@/custom/components/Chat/ChatWindow";
import { Flex } from "@chakra-ui/react";

const Chat = () => {
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [chats, setChats] = useState<ChatItemInterface[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatItemInterface | undefined>(undefined);

    const handleSelectChat = (chat: ChatItemInterface) => {
        setSelectedChat(chat);
    }

    return (
        <Flex 
            h={"full"} 
            w={"full"} 
            color="white" 
            overflow="hidden"
            borderRadius={4}
            border={"1px solid"}
            borderColor={colorMode == 'light' ? 'teal.400':"pink.600"}
            shadow={"2xl"}
        >
            <ChatSidebar
                chats={chats}
                setChats={setChats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                user={user}
            />

            <ChatWindow
                chats={chats}
                setChats={setChats}
                setSelectedChat={setSelectedChat}
                selectedChat={selectedChat}
                user={user}
            />
        </Flex>
    );
};

export default Chat;