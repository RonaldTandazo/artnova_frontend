import { BACKEND_URL } from "@/utils/Helpers";
import { Avatar, Box, Button, Flex, For, Heading, Icon, Link, Menu, Portal, Show, Spacer, Stack, Text, Textarea, VStack } from "@chakra-ui/react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { useColorMode } from "@/components/ui/color-mode";
import { PostingCommentsProps } from "@/custom/interfaces/ArtworkView/PostingComments";
import { IoMdSend } from "react-icons/io";
import LoadingProgress from "../../States/LoadingProgress";
import Empty from "../../States/Empty";
import { LuChevronDown } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";
import { useState } from "react";
import WarningDialog from "../../Dialogs/WarningDialog";
import { DeleteItem } from "@/custom/interfaces/Dialogs/WarningDialog";
import { ArtworkComment } from "@/custom/interfaces/ArtworkView/ArtworkView";

const ArtworkComments = ({
    user,
    comments,
    statsLoading,
    postLoading,
    postComment,
    deleteComment,
    onLike,
    onDislike,
    toProfile
}: PostingCommentsProps) => {
    const { colorMode } = useColorMode();
    const [comment, setComment] = useState<string>('');
    const [deleteItems, setDeleteItems] = useState<DeleteItem[]>([]);
    const isPostButtonDisabled = !user || (comment?.trim().length === 0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const toggleWarningDialog = (comment: ArtworkComment) => {
        setIsModalOpen(true);
        setDeleteItems(prev => [...prev, {id: comment.commentId, name: comment.comment}])
    }

    const handleCloseDelete = () => {
        setIsModalOpen(false);
        setDeleteItems([])
    };

    const handleConfirmDelete = async (items: DeleteItem[]) => {
        handleCloseDelete();
        
        const commentIds = items.map(item => String(item.id))
        deleteComment(commentIds)
    };

    return (
        <>
            <Box 
                p={5}
                minH="250px"                                 
                bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
            >
                <Box>
                    <Flex direction={"row"} justifyContent="space-between" width={"full"}  alignItems={"center"}>
                        <Heading size={"2xl"}>Comments</Heading>
                    </ Flex>
                    <Box 
                        mt={5}
                        p={3}
                        w={"full"} 
                        h={"auto"} 
                        maxH={"1250px"} 
                        borderRadius={4} 
                        shadow={"md"}
                        overflowY={"auto"}
                    >
                        <VStack h={"auto"}>
                            <Textarea 
                                autoresize 
                                placeholder='Type your comment here...' 
                                size={"lg"}
                                disabled={!user}
                                onChange={(e) => setComment(e.target.value)}
                                value={comment} 
                            />
                            <Flex alignItems={"center"} width={"full"}>
                                <Show
                                    when={!user}
                                >
                                    <Text fontWeight={"bold"} fontSize={"xs"}>
                                        **You must log in to Post or Reply to a Comment
                                    </Text>
                                </Show>

                                <Spacer /> 
                                
                                <Button
                                    size="xs"
                                    bg={colorMode === "light" ? "teal.400" : "pink.600"}
                                    color={"white"}
                                    shadow={"md"}
                                    borderRadius={"md"}
                                    onClick={() => {
                                        postComment(comment);
                                        setComment('');
                                    }}
                                    disabled={isPostButtonDisabled || postLoading}
                                    loading={postLoading}
                                >
                                    <IoMdSend /> Post
                                </Button>
                            </Flex>
                        </VStack>
                        <VStack w={"full"} h={"auto"} my={5}>
                            <Show
                                when={!statsLoading}
                                fallback={
                                    <LoadingProgress />
                                }
                            >
                                <Show
                                    when={comments.length > 0}
                                    fallback={
                                        <Empty
                                            title="No Comments Posted Yet"
                                        />
                                    }
                                >
                                    <For
                                        each={comments}
                                    >
                                        {(comment) => (
                                            <Box key={comment.commentId} w={"full"} h={"auto"} mb={3}>
                                                <Box borderRadius={4} p={3} border={"1px solid"} mb={1}>
                                                    <Stack direction="row">
                                                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                                                            <Link 
                                                                href={toProfile(comment.userId)}
                                                            >
                                                                <Avatar.Root key={"subtle"} variant={"subtle"}>
                                                                    <Show
                                                                        when={comment.avatar}
                                                                        fallback={
                                                                            <Avatar.Fallback name={comment.username} />
                                                                        }
                                                                    >
                                                                        <Avatar.Image src={`${BACKEND_URL}/avatars/${comment.avatar}`} />
                                                                    </Show>
                                                                </Avatar.Root>
                                                            </Link>
                                                        </Box>

                                                        <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"} justifyContent={"center"}>
                                                            <Link 
                                                                variant="plain" 
                                                                href={toProfile(comment.userId)} 
                                                                color={colorMode == "light" ? "teal.400":"pink.600"}
                                                            >
                                                                {comment.username}
                                                            </Link>
                                                            <Text>{comment.comment}</Text>
                                                        </Box>
                                                        
                                                        <Spacer />
                                                        
                                                        <VStack alignItems={"flex-end"} justifyContent={"space-between"}>
                                                            {user?.userId === comment.userId && (
                                                                <Menu.Root unmountOnExit lazyMount>
                                                                    <Menu.Trigger asChild cursor={"pointer"}>
                                                                        <LuChevronDown />
                                                                    </Menu.Trigger>
                                                                    <Portal>
                                                                        <Menu.Positioner>
                                                                            <Menu.Content minW={"1px"}>
                                                                                <Menu.Item 
                                                                                    value="delete" 
                                                                                    color="fg.error" 
                                                                                    _hover={{ bg: 'bg.error', color: 'fg.error' }} 
                                                                                    justifyContent={'center'} 
                                                                                    alignItems={'center'} 
                                                                                    cursor={"pointer"}
                                                                                    onClick={() => toggleWarningDialog(comment)}
                                                                                >
                                                                                    <Icon size={'sm'}>
                                                                                        <TiDelete />
                                                                                    </Icon>
                                                                                    Remove
                                                                                </Menu.Item>
                                                                            </Menu.Content>
                                                                        </Menu.Positioner>
                                                                    </Portal>
                                                                </Menu.Root>
                                                            )}

                                                            <VStack gap={1}>
                                                                <Text fontSize="sm">{comment.createdAt}</Text>
                                                                <Box display={"flex"} flexDirection={"row"} gap={3} width={"full"} justifyContent={"center"}>    
                                                                    <Show
                                                                        when={!user || (user && !comment.likes.includes(user.userId) && !comment.dislikes.includes(user?.userId))}
                                                                    >
                                                                        <BiLike 
                                                                            onClick={() => onLike(comment.commentId)} 
                                                                            cursor={"pointer"} 
                                                                            color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                                                            size={20}
                                                                        />
                                                                        <BiDislike 
                                                                            onClick={() => onDislike(comment.commentId)} 
                                                                            cursor={"pointer"}
                                                                            color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                                                            size={20}
                                                                        />
                                                                    </Show>
                                                                    <Show
                                                                        when={user && comment.likes.includes(user.userId)}
                                                                    >
                                                                        <BiSolidLike 
                                                                            onClick={() => onLike(comment.commentId)} 
                                                                            cursor={"pointer"} 
                                                                            color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                                                            size={20}
                                                                            />
                                                                    </Show>
                                                                    <Show
                                                                        when={user && comment.dislikes.includes(user.userId)}
                                                                    >
                                                                        <BiSolidDislike 
                                                                            onClick={() => onDislike(comment.commentId)} 
                                                                            cursor={"pointer"} 
                                                                            color={colorMode == 'light' ? '#0891b2':'#db2777'}
                                                                            size={20}
                                                                        />
                                                                    </Show>
                                                                </Box>
                                                            </VStack>
                                                        </VStack>
                                                    </Stack>
                                                </Box>
                                                
                                                <Box display={"flex"} flexDirection={"row"} mx={3} fontSize="sm">
                                                    <Text>Reply</Text>
                                                    <Show when={comment.replies.length > 0}>
                                                        <Text ml={3}>Show Replies</Text>
                                                    </Show>
                                                    <Spacer />
                                                    <Show when={comment.likes.length > 0}>
                                                        <Text ml={3}>{comment.likes.length} Likes</Text>
                                                    </Show>
                                                    <Show when={comment.dislikes.length > 0}>
                                                        <Text ml={3}>{comment.dislikes.length} Dislikes</Text>
                                                    </Show>
                                                </Box>
                                            </Box>
                                        )}
                                    </For>
                                </Show>
                            </Show>
                        </VStack>
                    </Box>
                </Box>
            </Box>

            <WarningDialog
                isOpen={isModalOpen}
                title={"Delete Comment"}
                message={"Are you sure you want to delete this comment?"}
                items={deleteItems}
                onClose={handleCloseDelete}
                onComplete={handleConfirmDelete}
            />
        </>
    )
}

export default ArtworkComments;