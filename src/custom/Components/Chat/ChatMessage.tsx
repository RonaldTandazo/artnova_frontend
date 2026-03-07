import { useColorMode } from "@/components/ui/color-mode";
import { Box, Text } from "@chakra-ui/react";
import { ChatMessagesInterface } from "./ChatInterfaces";

const ChatMessage = ({ message, currentUserId }: ChatMessagesInterface) => {
    const { colorMode } = useColorMode();

    return (
        <Box
            key={message.chatId}
            maxWidth="70%"
            padding={3} 
            borderRadius="lg" 
            marginBottom={3} 
            alignSelf={message.userId == currentUserId ? "flex-end" : "flex-start"}
            bg={message.userId == currentUserId
                ? (colorMode === "light" ? "cyan.100" : "pink.500")
                : (colorMode === "light" ? "gray.200" : "gray.600")
            }
            color={colorMode === "light" ? "black" : "white"}
        >
            <Text textAlign={"justify"}>{message.message}</Text>
            <Text textAlign={"right"} textStyle={"xs"}>{message.date}</Text>
        </Box>
    )
};

export default ChatMessage;