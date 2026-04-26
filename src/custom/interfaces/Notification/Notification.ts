export interface GetUserNotifications {
    getUserNotifications: {
        notifications: Notification[],
        unreadNotifications: number
        hasMore: boolean
    }
}

export interface Notification {
    notificationId: number;
    type: string;
    entityId: number;
    title: string;
    description: string;
    isRead: boolean;
    image?: string;
}