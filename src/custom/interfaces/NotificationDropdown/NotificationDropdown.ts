import { Notification } from "../Notification/Notification";

export interface NotificationDropdownProps {
    notifications: Notification[];
    onPress: (notificationId: number, fromIcon: boolean) => void;
    onLoadMore: () => void;
    loadingMore: boolean;
    hasMore: boolean;
    onMarkAll: () => void;
    unreadNotifications: number;
}