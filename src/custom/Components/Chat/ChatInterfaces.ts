import { ChatItemInterface, MessageInterface } from "@/graphql/Chat/ChatInterfaces";
import { Notification, User } from "@/custom/interfaces/General/GeneralInterfaces";
import { Dispatch, SetStateAction } from "react";

export interface ChatMessagesInterface {
    message: MessageInterface
    currentUserId: number
}

export interface ChatListItemInterface {
    chat: ChatItemInterface
    isSelected: boolean
    onClick: () => void
    currentUserId: number | undefined
}

export interface TriggerMessageInterface {
    state: boolean
    newMessage: MessageInterface | undefined
}

export interface ChatBoxInterface {
    openChat: boolean
    chatId: string | undefined
    user: User | undefined
    triggerMessage: TriggerMessageInterface
    onToggleNewMessage: () => void
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>> | undefined;
}

export interface ChatSidebarInterface {
    chats: ChatItemInterface[]
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    selectedChat: ChatItemInterface | undefined
    onSelectChat: (chat: ChatItemInterface) => void
    user: User | undefined
}

export interface ChatWindowInterface {
    chats: ChatItemInterface[]
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    setSelectedChat: Dispatch<SetStateAction<ChatItemInterface | undefined>>
    selectedChat: ChatItemInterface | undefined
    user: User | undefined
}

export interface ChatHeaderInterface{
    selectedChat: ChatItemInterface | undefined
    user: User | undefined
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    setSelectedChat: Dispatch<SetStateAction<ChatItemInterface | undefined>>
    onShowMessage: (dataNotification: Notification) => void
}