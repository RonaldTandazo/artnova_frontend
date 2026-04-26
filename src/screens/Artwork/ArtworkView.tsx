import { useColorMode } from '@/components/ui/color-mode';
import { useAuth } from '@/context/AuthContext';
import CarouselViewer from '@/custom/Components/Artwork/ArtworkView/CarouselViewer';
import LoadingProgress from '@/custom/Components/States/LoadingProgress';
import Empty from '@/custom/Components/States/Empty';
import { useGetArtworkDetails } from '@/services/Artwork/ArtworkService';
import { useDeleteArtworkComment, useGetArtworkStatistics, usePostArtworkComment, useStoreArtworkViews, useUpdateArtworkDisLikes, useUpdateArtworkFavorites, useUpdateArtworkLikes, useUpdateCommentDisLikes, useUpdateCommentLikes } from '@/services/ArtworkStatistics/ArtworkStatisticsService';
import { decodeFromBase64, encodeToBase64 } from '@/utils/Helpers';
import { Box, Grid, GridItem, Show, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InformationPanel from '@/custom/Components/Artwork/ArtworkView/InformationPanel';
import { ArtworkComment, ArtworkInformation, ArtworkStats } from '@/custom/interfaces/ArtworkView/ArtworkView';
import { OnDislikeData, OnFavoritesData, OnLikeData } from '@/custom/interfaces/ArtworkView/InformationPanel';
import ArtworkComments from '@/custom/Components/Artwork/ArtworkView/ArtworkComments';

const ArtworkView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { value: artworkId } = useParams();
    const { colorMode } = useColorMode();
    const [loading, setLoading] = useState<boolean>(true);
    const [artworkData, setArtworkData] = useState<ArtworkInformation | undefined>(undefined);
    const [artworkStatistics, setArtworkStatistics] = useState<ArtworkStats | undefined>(undefined);
    const [comments, setComments] = useState<ArtworkComment[]>([]);

    const { getArtworkDetails: GetArtworkDetails, data: artworkDetailsData, loading: artworkDetailsLoading } = useGetArtworkDetails();
    const { getArtworkStatistics: GetArtworkStatistics, data: getArtworkStatisticsData, loading: getArtworkStatisticsLoading } = useGetArtworkStatistics();
    const { storeArtworkViews: StoreArtworkViews } = useStoreArtworkViews();
    const { postArtworkComment: PostArtworkComment, loading: postCommentLoading } = usePostArtworkComment();
    const { deleteArtworkComment: DeleteArtworkComment } = useDeleteArtworkComment();
    const { updateArtworkLikes: UpdateArtworkLikes } = useUpdateArtworkLikes();
    const { updateArtworkDisLikes: UpdateArtworkDisLikes } = useUpdateArtworkDisLikes();
    const { updateArtworkFavorites: UpdateArtworkFavorites } = useUpdateArtworkFavorites();
    const { updateCommentLikes: UpdateCommentLikes } = useUpdateCommentLikes();
    const { updateCommentDisLikes: UpdateCommentDisLikes } = useUpdateCommentDisLikes();

    useEffect(() => {
        const artworkDecodedId = parseInt(decodeFromBase64(artworkId));
        StoreArtworkViews(artworkDecodedId)
        GetArtworkDetails(artworkDecodedId)
        GetArtworkStatistics(artworkDecodedId)
    }, [artworkId]);

    useEffect(() => {
        if(artworkDetailsData && artworkDetailsData?.getArtworkDetails){
            setArtworkData(artworkDetailsData.getArtworkDetails)
            setLoading(false);
        }

    }, [artworkDetailsData])

    useEffect(() => {
        if(getArtworkStatisticsData && getArtworkStatisticsData.getArtworkStatistics){
            setArtworkStatistics(getArtworkStatisticsData.getArtworkStatistics.stats)
            setComments(getArtworkStatisticsData.getArtworkStatistics.comments)
        }

    }, [getArtworkStatisticsData])

    const checkAuthentication = () => {
        navigate('/SignIn');
        return;
    }

    const handleArtworkLikes = (likes: number[], data: OnLikeData) => {
        if(artworkStatistics){
            setArtworkStatistics({...artworkStatistics, likes: likes})
            UpdateArtworkLikes(data);
        }
    }

    const handleArtworkDisLikes = (dislikes: number[], data: OnDislikeData) => {
        if(artworkStatistics){
            setArtworkStatistics({...artworkStatistics, dislikes: dislikes});
            UpdateArtworkDisLikes(data);
        }
    }

    const handleArtworkFavorites = (favorites: number[], data: OnFavoritesData) => {
        if(artworkStatistics){
            setArtworkStatistics({...artworkStatistics, favorites: favorites});
            UpdateArtworkFavorites(data);
        }
    }

    const postComment = async (comment: string) => {
        if(user && artworkData && artworkStatistics){
            if (!comment || comment.trim().length === 0) {
                return;
            }
    
            const commentPost = {
                artworkId: artworkData.artworkId,
                avatar: user.avatar,
                comment: comment.trim(),
            }
            
            await PostArtworkComment(commentPost);
            await GetArtworkStatistics(artworkData.artworkId)
        }
    }

    const deleteComments = (commentIds: string[]) => {
        if(user && artworkData && artworkStatistics){
            if (!commentIds || commentIds.length == 0) {
                return;
            }
    
            const deleteComment = {
                artworkId: artworkData.artworkId,
                commentIds: commentIds,
            }

            DeleteArtworkComment(deleteComment);
            
            const newStats: ArtworkStats = {
                ...artworkStatistics,
                commentsAmount: (artworkStatistics?.commentsAmount ?? 1) - commentIds.length
            };

            setComments(prev => prev.filter(comment => !commentIds.includes(comment.commentId)));
            setArtworkStatistics(newStats);
        }
    }

    const handleCommentLikes = (commentId: string) => {
        if(user){
            let commentChange = false;
            const currentUserId = user.userId;
            const updatedComments = comments.map(comment => {
                if (comment.commentId === commentId) {
                    const userIndex = comment.likes.findIndex((userId: number) => userId === currentUserId);
                    let newLikesArray;
    
                    if (userIndex === -1) {
                        newLikesArray = [...comment.likes, currentUserId];
                    } else {
                        newLikesArray = [
                            ...comment.likes.slice(0, userIndex),
                            ...comment.likes.slice(userIndex + 1)
                        ];
                    }
    
                    commentChange = true;
    
                    const newComment = {
                        ...comment,
                        likes: newLikesArray,
                    };
    
                    const data = {
                        artworkId: artworkData?.artworkId,
                        commentId: newComment.commentId,
                        likes: newComment.likes
                    }
    
                    UpdateCommentLikes(data)
    
                    return newComment
                }
                return comment;
            });
    
            if(commentChange){
                setComments(updatedComments)
            }
        }else{
            checkAuthentication()
        }
    }

    const handleCommentDisLikes = (commentId: string) => {
        if(user){
            let commentChange = false;
            const currentUserId = user.userId;
            const updatedComments = comments.map(comment => {
                if (comment.commentId === commentId) {
                    const userIndex = comment.dislikes.findIndex((userId: number) => userId === currentUserId);
                    let newDisLikesArray;
    
                    if (userIndex === -1) {
                        newDisLikesArray = [...comment.dislikes, currentUserId];
                    } else {
                        newDisLikesArray = [
                            ...comment.dislikes.slice(0, userIndex),
                            ...comment.dislikes.slice(userIndex + 1)
                        ];
                    }
    
                    commentChange = true;
    
                    const newComment = {
                        ...comment,
                        dislikes: newDisLikesArray, 
                    };
    
                    const data = {
                        artworkId: artworkData?.artworkId,
                        commentId: newComment.commentId,
                        dislikes: newComment.dislikes
                    }
    
                    UpdateCommentDisLikes(data)
    
                    return newComment
                }
                return comment;
            });
    
            if(commentChange){
                setComments(updatedComments)
            }
        }else{
            checkAuthentication()
        }
    }

    const handleNavigateProfile = (userId: number | undefined) => {
        if(userId){
            const encodedUserId = encodeToBase64(userId);
            const encodedModule = encodeToBase64(user && userId == user.userId ? 'OwnProfile':'VisitProfile');

            const safeUserId = encodeURIComponent(encodedUserId);
            const safeModule = encodeURIComponent(encodedModule);
            
            return `/Profile/${safeUserId}/${safeModule}`
        }

        return '#';
    }

    return (
        <Show
            when={!artworkDetailsLoading && !loading && artworkData}
            fallback={
                <LoadingProgress />
            }
        >
            <Box pb={5}>
                <Show
                    when={artworkDetailsData?.getArtworkDetails}
                    fallback={
                        <>
                            <Empty 
                                title = "Oooh no!... There's no information about the ArtWork you selected 😢"
                                description = "Don't worry, there are many other amazing Arts for you to discover!"
                            />
                            {/* <ArtVerseGrid /> */}
                        </>
                    }
                >
                    <Grid
                        templateColumns="1fr minmax(250px, 500px)"
                        gap={5}
                        // p={5}
                    >
                        {/* 1. Contenido Principal (Scrollable) */}
                        <GridItem>
                            <Stack 
                                p={5}
                                mb={5}
                                gap={15}
                                minH={"600px"} 
                                justify={"center"}
                                bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
                            >
                                <Show
                                    when={artworkData && (artworkData.images.length > 0 || artworkData.videos.length > 0)}
                                    fallback={
                                        <Empty
                                            title="No Multimedia Posted Yet"
                                        />
                                    }
                                >
                                    <Show
                                        when={artworkData?.images && artworkData.images.length > 0}
                                    >
                                        <Box  
                                            p={3}
                                            w={"full"} 
                                            h={"1000px"} 
                                            maxH={"1250px"} 
                                            borderRadius={4} 
                                            shadow={"md"}
                                        >
                                            <CarouselViewer type="images" files={artworkData ? artworkData.images:[]}/>
                                        </Box>
                                    </Show>
                                    <Show
                                        when={artworkData?.videos && artworkData.videos.length > 0}
                                    >
                                        <Box 
                                            p={3}
                                            w={"full"} 
                                            h={"1000px"} 
                                            maxH={"1250px"} 
                                            borderRadius={4} 
                                            shadow={"md"}
                                        >
                                            <CarouselViewer type="videos" files={artworkData ? artworkData.videos:[]} />
                                        </Box>
                                    </Show>
                                </Show>
                            </Stack>

                            <ArtworkComments 
                                user={user}
                                comments={comments}
                                statsLoading={getArtworkStatisticsLoading}
                                postLoading={postCommentLoading}
                                postComment={postComment}
                                deleteComment={deleteComments}
                                onLike={handleCommentLikes}
                                onDislike={handleCommentDisLikes}
                                toProfile={handleNavigateProfile}
                            />
                        </GridItem>

                        <GridItem>
                            <InformationPanel
                                user={user}
                                artworkData={artworkData} 
                                artworkStatistics={artworkStatistics}
                                onLike={handleArtworkLikes}
                                onDisLike={handleArtworkDisLikes}
                                onFavorites={handleArtworkFavorites}
                                toProfile={handleNavigateProfile}
                                checkAuthentication={checkAuthentication}
                            />
                        </GridItem>
                    </Grid>
                </Show>
            </Box>
        </Show>
    );
};

export default ArtworkView;
