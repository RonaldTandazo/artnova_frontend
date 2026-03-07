import { Box, For, Show, VStack } from "@chakra-ui/react";
import LoadingProgress from "../States/LoadingProgress";
import ChatMessage from "./ChatMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, MESSAGES_LIMIT } from "@/utils/Helpers";
import { ChatBoxInterface } from "./ChatInterfaces";
import { useGetMessage, useGetSingleChat } from "@/services/Chat/ChatService";
import { MessageInterface } from "@/graphql/Chat/ChatInterfaces";

const ChatBox = ({openChat, chatId, user, triggerMessage, onToggleNewMessage, setChats}: ChatBoxInterface) => {
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true); 
    const [offset, setOffset] = useState<number>(0);
    const [messages, setMessages] = useState<MessageInterface[]>([]);

    const {getChatData, data: chatData} = useGetSingleChat();

    const handleAddRealtimeMessage = useCallback((newMessage: MessageInterface) => {
        setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1]
            
            const exists = lastMessage.userId === newMessage.userId && lastMessage.message == newMessage.message;
            
            if (exists) {
                return prevMessages;
            }

            console.log(newMessage)
            console.log(newMessage.date)
            const messageDate = new Date(newMessage!.date);

            setChats(prev => prev.map((c) => {
                if (c.chatId == chatId) {
                    return { 
                        ...c, 
                        lastMessage: {userId: user.userId, message: newMessage.message, date: formatDate(messageDate)}
                    };
                }
    
                return c;
            }));
            
            return [...prevMessages, newMessage];
        });

        setTimeout(scrollToBottom, 0); 
    }, []);

    useGetMessage({
        chatId: chatId,
        onMessageReceived: handleAddRealtimeMessage,
    });

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);
    const initialLoadRef = useRef(true);

    useEffect(() => {
        if(openChat && chatId && hasMore){
            if(loadingHistory) {
                getChatData(chatId, {limit: MESSAGES_LIMIT, offset: offset})
            } else if (offset === 0 && !loadingHistory) {
                setLoadingHistory(true);
                getChatData(chatId, {limit: MESSAGES_LIMIT, offset: offset})
            }
        }
    }, [openChat, offset])

    useEffect(() => {
        if(chatData && chatData.getChatArtist){
            const { messages: newMessages, hasMore: newHasMore } = chatData.getChatArtist;
            setMessages(prevMessages => {
                const uniqueNewMessages = newMessages.filter(
                    (newMsg: MessageInterface) => !prevMessages.some(
                        (oldMsg: MessageInterface) => oldMsg.messageId === newMsg.messageId
                    )
                );

                return [...uniqueNewMessages, ...prevMessages];
            });

            setHasMore(newHasMore);
            setLoadingHistory(false);
        }
    }, [chatData])
    

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || !openChat) return;

        if (initialLoadRef.current && !loadingHistory && messages.length > 0) {
            scrollToBottom();
            
            initialLoadRef.current = false;    
        } 
            
        if (!loadingHistory && !initialLoadRef.current) {
            maintainScrollPosition(container);
        }        
    }, [openChat, messages.length]); 


    useEffect(() => {
        if(triggerMessage.state && triggerMessage.newMessage){
            const newMessage: MessageInterface = triggerMessage.newMessage;
            setMessages(prevMessages => [...prevMessages, newMessage]);      
            setTimeout(scrollToBottom, 0); 
            onToggleNewMessage();
        }
    }, [triggerMessage])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        
        if (messages.length < MESSAGES_LIMIT || loadingHistory || !hasMore || initialLoadRef.current || isScrollingRef.current) return; 
        
        const isNearTop = container.scrollTop <= 10;
        
        if (isNearTop && !loadingHistory) {
            container.dataset.previousScrollHeight = String(container.scrollHeight);
            setLoadingHistory(true);
            setOffset(prevOffset => prevOffset + MESSAGES_LIMIT)
        }
    };

    const scrollToBottom = () => {
        if (!messagesEndRef.current || !openChat) return;
        
        isScrollingRef.current = true;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
            isScrollingRef.current = false;
        }, 1500);
    };

    const maintainScrollPosition = (container: HTMLDivElement) => {
        const previousScrollHeightString = container.dataset.previousScrollHeight;
        
        if (previousScrollHeightString) {
            const previousScrollHeight = Number(previousScrollHeightString);
            const newScrollHeight = container.scrollHeight;
            
            container.scrollTop = newScrollHeight - previousScrollHeight;
            
            delete container.dataset.previousScrollHeight;
        }
    }

    return (
        <VStack
            flex={1}
            align="stretch"
            h={"80%"}
        >
            <Box
                padding={5}
                w={"full"}
                h={"full"}
                display="flex" 
                flexDirection="column" 
                overflowY="auto"
                onScroll={handleScroll}
                ref={messagesContainerRef}
            >
                <Show
                    when={loadingHistory}
                >
                    <LoadingProgress />
                </Show>

                <For each={messages}>
                    {(msg) => (
                        <ChatMessage
                            key={msg.messageId}
                            message={msg}
                            currentUserId={user?.userId}
                        />
                    )}
                </For>
                
                <Box ref={messagesEndRef} />
            </Box>
        </VStack>
    );
}

export default ChatBox;