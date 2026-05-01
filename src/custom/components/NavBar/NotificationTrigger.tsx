import { Box, Circle, Float, Icon, Popover, Show } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "../Notification/NotificationDropdown";
import { useCallback, useEffect, useState } from "react";
import { useGetNotificationWS, useGetUserNotifications, useMarkAllAsRead, useMarkNotificationAsRead } from "@/services/Notification/NotificationService";
import { Notification } from "@/custom/interfaces/Notification/Notification";
import { NotificationTriggerProps } from "@/custom/interfaces/NavBar/NotificationTrigger";
import { Tooltip } from "@/components/ui/tooltip";
import { useColorMode } from "@/components/ui/color-mode";

const NotificationTrigger = ({ user }: NotificationTriggerProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const { colorMode } = useColorMode();

    const { getUserNotifications, data: userNotifications } = useGetUserNotifications();
    const { markAllAsRead } = useMarkAllAsRead();
    const { markNotificationAsRead } = useMarkNotificationAsRead();

    useEffect(() => {
        getUserNotifications({page: page})
    }, [])

    const loadMore = async () => {
        if (loading || !hasMore) return;
  
        setLoading(true);
  
        const nextPage = page + 1;
        await getUserNotifications({page: nextPage});
        setPage(nextPage);
    };

    const handleAddNotification = useCallback((notification: Notification) => {
        setNotifications(prev => {
            const exists = prev.some(n => n.notificationId === notification.notificationId);
            if (exists) return prev;

            return [notification, ...prev];
        });
    }, []);
    
    useGetNotificationWS({
        userId: user?.userId,
        onNotification: handleAddNotification
    });

    useEffect(() => {
        if(userNotifications?.getUserNotifications){
            const { notifications: newNotifications, unreadNotifications, hasMore: backendHasMore } = userNotifications.getUserNotifications;
                        
            setNotifications(prev => [...prev, ...newNotifications]);
            setUnreadNotifications(unreadNotifications);
            setHasMore(backendHasMore);
            setLoading(false);
        }
    }, [userNotifications])

    const onPress = async (notificationId: number, fromIcon: boolean) => {
        if(!fromIcon) setOpen(false);

        const record = notifications.find(notification => notification.notificationId == notificationId);
        if(record && !record.isRead){
            setNotifications(prev => prev.map((notification) => {
                if(notification.notificationId == notificationId){
                    return {
                        ...notification,
                        isRead: true
                    }
                }
    
                return notification;
            }))

            setUnreadNotifications(unreadNotifications - 1)

            await markNotificationAsRead({notificationId: notificationId});
        }
    }

    const onMarkAll = async () => {
        setNotifications(prev => prev.map((notification) => {
            return {
                ...notification,
                isRead: true
            };
        }));

        setUnreadNotifications(0);

        await markAllAsRead();
    }

    return (
        <Popover.Root 
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            positioning={{ placement: "bottom-end" }}
        >
            <Popover.Trigger asChild>
                <Box position="relative" cursor={"pointer"}>
                    <Tooltip
                        content={`Notifications`}
                        openDelay={200}
                        closeDelay={100}
                        unmountOnExit={true}    
                        lazyMount={true}
                        positioning={{ placement: "left" }}
                        showArrow
                        contentProps={{ 
                            css: { 
                                "--tooltip-bg": colorMode === "light" ? "white":"black",
                                "color": colorMode === "light" ? "black":"white"
                            }
                        }}
                    >
                        <Icon color={"white"} size={"lg"}>
                            <FaBell />
                        </Icon>
                    </Tooltip>

                    <Show when={unreadNotifications > 0}>
                        <Float>
                            <Circle size="5" bg="black" color="white" fontSize={"xs"}>
                                {unreadNotifications}
                            </Circle>
                        </Float>
                    </Show>
                </Box>
            </Popover.Trigger>

            <Popover.Positioner>
                <Popover.Content 
                    width="350px" 
                    zIndex="1000"
                >
                    <Popover.Arrow />
                    
                    <NotificationDropdown 
                        notifications={notifications}
                        onPress={(notificationId, fromIcon) => onPress(notificationId, fromIcon)}
                        onLoadMore={() => loadMore()}
                        loadingMore={loading}
                        hasMore={hasMore}
                        onMarkAll={onMarkAll}
                        unreadNotifications={unreadNotifications}
                    />
                </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    );
}

export default NotificationTrigger; 