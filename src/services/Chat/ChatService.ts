import { GetSingleChatInterface, GetChatsInterface, SetChatInterface, SetChatMessageInterface, PaginationInterface, MessageSubscription, DeleteChatInterface, DeleteChatInputInterface } from '@/graphql/Chat/ChatInterfaces';
import { DELETE_CHAT, SET_CHAT_MESSAGE } from '@/graphql/Chat/ChatMutations';
import { GET_CHAT_ARTIST, GET_CHATS } from '@/graphql/Chat/ChatQueries';
import { MESSAGE_SENT_SUBSCRIPTION } from '@/graphql/Chat/ChatSubscriptions';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/client/react';

export const useGetChats = () => {
    const [execute, { data, loading, error }] = useLazyQuery<GetChatsInterface>(GET_CHATS, {
        fetchPolicy: "cache-and-network"
    });

    const getChatsData = async (pagination: PaginationInterface) => {
        return execute({
            variables: { pagination }
        });
    };

    return {
        getChatsData,
        data,
        loading,
        error,
    };
};

export const useGetSingleChat = () => {
    const [execute, { data, loading, error }] = useLazyQuery<GetSingleChatInterface>(GET_CHAT_ARTIST, {
        fetchPolicy: "cache-and-network"
    });

    const getChatData = async (chatId: string, pagination: PaginationInterface) => {
        console.log(pagination)
        return execute({ 
            variables: { chatId, pagination }
        });
    };

    return {
        getChatData,
        data,
        loading,
        error,
    };
};

export const useSetChatMessage = () => {
    const [execute, { data, loading, error }] = useMutation<SetChatInterface>(SET_CHAT_MESSAGE);

    const setChatMessage = async (chat: SetChatMessageInterface) => {
        return execute({ 
            variables: { chat }
        });
    };

    return {
        setChatMessage,
        data,
        loading,
        error,
    };
};

export const useGetMessage = ({chatId, onMessageReceived}: MessageSubscription) => {
    useSubscription(
        MESSAGE_SENT_SUBSCRIPTION,
        {
            variables: { chatId },
            skip: !chatId,
            onData: ({ data }: any) => {
                if (data?.data?.messageSent) {
                    onMessageReceived(data.data.messageSent);
                }
            }
        }
    );
}

export const useDeleteChat = () => {
    const [execute, { data, loading, error }] = useMutation<DeleteChatInterface>(DELETE_CHAT);

    const deleteChat = async (input: DeleteChatInputInterface) => {
        return execute({ 
            variables: { input }
        });
    };

    return {
        deleteChat,
        data,
        loading,
        error,
    };
};
