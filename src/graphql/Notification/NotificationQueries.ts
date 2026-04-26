import { gql } from '@apollo/client/core';

export const Notification = gql`
    fragment Notification on NotificationPayload {
        notificationId
        type
        entityId
        title
        description
        isRead
        image
    }
`;

export const GET_USER_NOTIFICATIONS = gql`
    query GetUserNotifications($data: UserNotificationsInput!) { 
        getUserNotifications(input: $data) {
            notifications {
                ...Notification
            }
            unreadNotifications
            hasMore
        }
    }
    ${Notification}
`;

export const MARK_ALL_AS_READ = gql`
    mutation MarkAllAsRead{ 
        markAllAsRead
    }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
    mutation MarkNotificationAsRead($data: MarkNotificationAsReadInput!){ 
        markNotificationAsRead(input: $data)
    }
`;