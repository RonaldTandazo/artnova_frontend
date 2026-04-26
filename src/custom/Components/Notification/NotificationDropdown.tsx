import { NotificationDropdownProps } from "@/custom/interfaces/NotificationDropdown/NotificationDropdown";
import { Box, For, HStack, Icon, Image, Separator, Show, Stack, Text, VStack } from "@chakra-ui/react";
import Empty from "../States/Empty";
import { Fragment } from "react/jsx-runtime";
import { BACKEND_URL, encodeToBase64 } from "@/utils/Helpers";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/custom/interfaces/Notification/Notification";
import LoadingProgress from "../States/LoadingProgress";
import { useColorMode } from "@/components/ui/color-mode";
import { FaBell, FaRegImages } from "react-icons/fa";
import { PiUserPlusFill } from "react-icons/pi";
import { BsCheck2All } from "react-icons/bs";

const NotificationDropdown = ({ 
    notifications,
    onPress,
    onLoadMore,
    loadingMore,
    hasMore,
    onMarkAll,
    unreadNotifications
}: NotificationDropdownProps) => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - scrollTop <= clientHeight + 50 && !loadingMore && hasMore) {
            if (onLoadMore) onLoadMore();
        }
    };

    const handleNavigate = (notification: Notification) => {
        switch (notification.type) {
            case 'NEW_ARTWORK':
                navigateToArtwork(notification.entityId);
                break;

            case 'NEW_FOLLOWER':
                navigateToUser(notification.entityId)
                break;

            default:
                break;
        }

        if (onPress) onPress(notification.notificationId, false);
    }

    const navigateToArtwork = (artworkId: number) => {
        const encodedArtworkId = encodeToBase64(artworkId);

        const safeArtworkId = encodeURIComponent(encodedArtworkId);

        navigate(`/ArtWorks/View/${safeArtworkId}`);
    }

    const navigateToUser = (userId: number) => {
        const encodedUserId = encodeToBase64(userId);
        const encodedModule = encodeToBase64('VisitProfile');

        const safeUserId = encodeURIComponent(encodedUserId);
        const safeModule = encodeURIComponent(encodedModule);
        
        navigate(`/Profile/${safeUserId}/${safeModule}`);
    }

    const handleAvatarImage = (notification: Notification): string => {
        let path = '';

        switch (notification.type) {
            case 'NEW_ARTWORK':
                path = '/thumbnails/';
                break;

            case 'NEW_FOLLOWER':
                path = '/avatars/';
                break;
        
            default:
                break;
        }

        return `${BACKEND_URL}${path}${notification.image}`;
    }

    const handleDefaulImage = (notification: Notification) => {
        switch (notification.type) {
            case 'NEW_ARTWORK':
                return <FaRegImages />
        
            case 'NEW_FOLLOWER':
                return <PiUserPlusFill />;

            default:
                return <FaBell />;
        }
    }

    return (
        <Show
            when={notifications.length > 0}
            fallback={
                <Empty
                    showIcon={false}
                    showDescription={false}
                    title="No Notifications"
                />
            }
        >
            <VStack 
                align="stretch"
                gap={0}
            >
                <HStack justify="space-between" align={"center"} p={3} pb={2}>
                    <Text 
                        fontSize="md"
                        fontWeight="bold"
                    >
                        Notifications
                    </Text>
                    <Text 
                        fontSize="small"
                        fontWeight="semibold"
                        cursor={unreadNotifications > 0 ? "pointer":"disabled"}
                        color={
                            colorMode === 'light' ? (unreadNotifications > 0 ? 'teal.400':'teal.200')
                            :(unreadNotifications > 0 ? 'pink.600':'pink.200')
                        }
                        onClick={() => unreadNotifications > 0 ? onMarkAll() : null}
                    >
                        Mark all as read
                    </Text>
                </HStack>

                <Separator />

                <Box
                    maxH={"400px"}
                    overflowY="auto" 
                    onScroll={handleScroll}
                >
                    <VStack align="stretch" p={3}>
                        <For each={notifications}>
                            {(notification, index) => (
                                <Fragment key={notification.notificationId}>
                                    <Stack
                                        key={notification.notificationId}
                                        position="relative"
                                    >
                                        <Show
                                            when={!notification.isRead}
                                        >
                                            <Box 
                                                position="absolute" 
                                                left={0} 
                                                top={2} 
                                                bottom={2} 
                                                width="4px" 
                                                bg="blue.500" 
                                                borderRadius="full" 
                                            />
                                        </Show>

                                        <HStack 
                                            cursor={"pointer"}
                                            pl={!notification.isRead ? 3 : 0}
                                            onClick={() => handleNavigate(notification)}
                                            align={"center"}
                                            justify={"center"}
                                            flex={1}
                                        >
                                            <Box 
                                                flexShrink={0} 
                                                borderRadius="md" 
                                                overflow="hidden" 
                                                boxSize="45px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                bg={colorMode === 'light' ? 'teal.400' : 'pink.600'}
                                                color={'white'}
                                                rounded={"full"}
                                            >
                                                <Show
                                                    when={notification.image && notification.image !== ''}
                                                    fallback={
                                                        <Icon
                                                            size={"md"}
                                                        >
                                                            {handleDefaulImage(notification)}
                                                        </Icon>
                                                    }
                                                >
                                                    <Image 
                                                        src={handleAvatarImage(notification)} 
                                                        alt={notification.title} 
                                                        fit="cover"
                                                        boxSize="100%"
                                                    />
                                                </Show>
                                            </Box>

                                            <VStack align={"center"} gap={0} flex={1}>
                                                <Text 
                                                    fontWeight={!notification.isRead ? "bold" : "normal"}
                                                    opacity={!notification.isRead ? 1 : 0.7}
                                                    lineClamp={1}
                                                    w={"full"}
                                                >
                                                    {notification.title}
                                                </Text>
                                                <Text 
                                                    fontSize="sm"
                                                    lineClamp={2}
                                                    w="full"
                                                >
                                                    {notification.description}
                                                </Text>
                                            </VStack>

                                            <Show when={!notification.isRead}>
                                                <Icon 
                                                    as={BsCheck2All}
                                                    color={colorMode == 'light' ? 'teal.400':'pink.600'}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (onPress) onPress(notification.notificationId, true);
                                                    }}
                                                />
                                            </Show>
                                        </HStack>
                                    </Stack>
                                        
                                    <Show
                                        when={index < notifications.length - 1}
                                    >
                                        <Separator my={1} />
                                    </Show>
                                </Fragment>
                            )}
                        </For>
                    </VStack>

                    <Show
                        when={loadingMore}
                    >
                        <Box
                            mb={3}
                        >
                            <LoadingProgress />
                        </Box>
                    </Show>
                </Box>

            </VStack>
        </Show>
    );
}

export default NotificationDropdown