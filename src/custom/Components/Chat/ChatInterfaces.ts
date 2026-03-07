import { ChatItemInterface, MessageInterface } from "@/graphql/Chat/ChatInterfaces";
import { Notification, User } from "@/custom/interfaces/general/GeneralInterfaces";
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
    user: User | null
    triggerMessage: TriggerMessageInterface
    onToggleNewMessage: () => void
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
}

export interface ChatSidebarInterface {
    chats: ChatItemInterface[]
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    selectedChat: ChatItemInterface | undefined
    onSelectChat: (chat: ChatItemInterface) => void
    user: User | null
}

export interface ChatWindowInterface {
    chats: ChatItemInterface[]
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    setSelectedChat: Dispatch<SetStateAction<ChatItemInterface | undefined>>
    selectedChat: ChatItemInterface | undefined
    user: User | null
}

export interface ChatHeaderInterface{
    selectedChat: ChatItemInterface | undefined
    user: User | null
    setChats: Dispatch<SetStateAction<ChatItemInterface[]>>;
    setSelectedChat: Dispatch<SetStateAction<ChatItemInterface | undefined>>
    onShowMessage: (dataNotification: Notification) => void
}