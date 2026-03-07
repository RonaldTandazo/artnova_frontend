// GET ALL CHATS
export interface PaginationInterface {
    limit: number
    offset: number
}

export interface GetChatsInterface {
    getChats: ChatItemInterface[]
}

export interface ChatItemInterface {
    chatId: string
    artist: ArtistChatInterface
    lastMessage: LastMessageInterface
    isFollowing: boolean
    isBlocked: boolean
    hasBlockedMe: boolean
}

export interface ArtistChatInterface {
    artistId: number
    username: string
    avatar: string | undefined
}

export interface LastMessageInterface {
    userId: number
    message: string
    date: string
}

// GET SINGLE CHAT
export interface GetSingleChatInterface {
    getChatArtist: SingleChatInterface
}

export interface SingleChatInterface {
    messages: MessageInterface[]
    hasMore: boolean
}

export interface MessageInterface {
    chatId: string | undefined
    messageId: string | undefined
    userId: number
    typeMessage: string
    message: string
    createdAt: string
    date: string
}

export interface MessageSubscription {
    chatId: string | undefined
    onMessageReceived: any
}

export interface SetChatMessageInterface {
    chatId: string | undefined
    artistId: number
    message: MessageInterface
}

export interface SetChatInterface {
    setChatMessage: {
        chatId: string
    }
}

export interface DeleteChatInputInterface {
    chatId: string
}

export interface DeleteChatInterface {
    deleteChat: string
}