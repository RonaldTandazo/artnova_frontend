import { GetUserNotifications } from "@/custom/interfaces/Notification/Notification";
import { GET_USER_NOTIFICATIONS, MARK_ALL_AS_READ, MARK_NOTIFICATION_AS_READ } from "@/graphql/Notification/NotificationQueries";
import { NOTIFICATION_SUBSCRIPTION } from "@/graphql/Notification/NotificationSubscription";
import { CombinedGraphQLErrors } from "@apollo/client";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client/react";

export const useGetNotificationWS = ({userId, onNotification}: any) => {
    useSubscription(
        NOTIFICATION_SUBSCRIPTION,
        {
            variables: { userId },
            skip: !userId,
            onData: ({ data }: any) => {
                const notification = data?.data?.notificationReceived;
                if (notification) {
                    onNotification(notification);
                }
            }
        }
    );
}

export const useGetUserNotifications = () => {
    const [execute, { loading, data, error }] = useLazyQuery<GetUserNotifications>(GET_USER_NOTIFICATIONS, {
        fetchPolicy: "network-only"
    })

    const GetUserNotifications = async (data: any) => {
        return execute({
            variables: { data }
        });
    };

    return {
        getUserNotifications: GetUserNotifications,
        data,
        loading,
        error,
    };
};

export const useMarkAllAsRead = () => {
    const [markAllAsRead, { loading, data, error }] = useMutation(MARK_ALL_AS_READ);

    const MarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        markAllAsRead: MarkAllAsRead,
        data,
        loading,
        error,
    };
};

export const useMarkNotificationAsRead = () => {
    const [markNotificationAsRead, { loading, data, error }] = useMutation(MARK_NOTIFICATION_AS_READ);

    const MarkNotificationAsRead = async (data: any) => {
        try {
            await markNotificationAsRead({
                variables: { data }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        markNotificationAsRead: MarkNotificationAsRead,
        data,
        loading,
        error,
    };
};