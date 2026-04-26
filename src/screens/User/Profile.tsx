import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Flex, Grid, IconButton, Show } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserSocialMedia } from "@/services/UserSocialNetwork/UserSocialNetworkService";
import { useDeleteUserArtworks, useGetUserArtworks } from "@/services/Artwork/ArtworkService";
import { useSubscription } from "@apollo/client/react";
import { NEW_ARTWORK_SUBSCRIPTION } from "@/graphql/Artwork/ArtworkSubscription";
import LoadingProgress from "@/custom/Components/States/LoadingProgress";
import { decodeFromBase64, encodeToBase64 } from "@/utils/Helpers";
import { useGetUserData, useGetUserStatsData } from "@/services/User/UserService";
import { GeneralInfoInterface } from "@/graphql/User/UserInterfaces";
import { useGetFollowState, useSetFollowState, useUnsetFollowState } from "@/services/Follow/FollowService";
import ArtistSidebar from "@/custom/Components/Profile/ArtistSidebar";
import ArtistContent from "@/custom/Components/Profile/ArtistContent";
import { GetArtworksWS } from "@/custom/interfaces/Profile/Profile";
import { Artwork } from "@/custom/interfaces/Profile/ArtistContent";
import { UserSocialMedia } from "@/custom/interfaces/ProfileSettings/ProfileSocialMedia";
import { UserStats } from "@/custom/interfaces/General/GeneralInterfaces";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { value, module } = useParams();
    const { colorMode } = useColorMode();

    const [loading, setLoading] = useState<boolean>(true);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState<boolean>(false);
    const [isUserInfoVisible, setIsUserInfoVisible] = useState<boolean>(true);
    const [userSocialMedia, setUserSocialMedia] = useState<UserSocialMedia[]>([]);
    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [openMenuId, setOpenMenuId] = useState<number | undefined>(undefined);
    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(true)
    const [userData, setUserData] = useState<GeneralInfoInterface | undefined>(undefined)
    const [userStats, setUserStats] = useState<UserStats | undefined>(undefined)
    const [isFollowed, setIsFollowed] = useState<boolean>(false)
    
    const { getUserSocialMedia, data: userSocialMediaData, loading: userSocialMediaLoading } = useGetUserSocialMedia();
    const { getUserArtworks, data: userArtworksData, loading: userArtworksLoading } = useGetUserArtworks();
    const { deleteUserArtworks } = useDeleteUserArtworks();
    const { getUserStats, data: userStatsData } = useGetUserStatsData();
    const { getFollowState, data: followStateData } = useGetFollowState();
    const { getUserGeneralData, data: userGeneralData } = useGetUserData();
    const { setFollowState } = useSetFollowState();
    const { unsetFollowState } = useUnsetFollowState();
    const { data } = useSubscription<GetArtworksWS>(NEW_ARTWORK_SUBSCRIPTION);

    const charsPerLine = 50;
    const maxLines = 2;
    const estimatedLines = userData?.summary && userData.summary !== '' ? Math.ceil(userData?.summary.length / charsPerLine) : 0;
    const shouldExpand = estimatedLines > maxLines;

    const truncatedSummary = userData?.summary && shouldExpand && !isSummaryExpanded
        ? userData.summary.slice(0, maxLines * charsPerLine) + '...'
        : userData?.summary;

    useEffect(() => {
        if(value && module){
            const userId = parseInt(decodeFromBase64(value));
            const moduleDecoded = decodeFromBase64(module);
            
            setLoading(true);
            setArtworks([]);
            setUserSocialMedia([]);
            setUserData(undefined);
            setIsOwnProfile(moduleDecoded === 'OwnProfile');
            setOpenMenuId(undefined);
            
            const searchData = {
                userId: userId,
                module: moduleDecoded
            }
            
            if(moduleDecoded != 'OwnProfile') {
                getUserGeneralData(userId)
                getFollowState({followedId: userId})
            } else {
                if(user){    
                    setUserData({
                        ...user,
                        chatId: undefined
                    });
                }
            }
            
            getUserStats(moduleDecoded != 'OwnProfile' ? userId : undefined)
            getUserArtworks(searchData)
            getUserSocialMedia(searchData);
        }
    }, [value, module, user]);

    useEffect(() => {
        if(!isOwnProfile && userGeneralData && userGeneralData.getUserGeneralData){
            setUserData(userGeneralData.getUserGeneralData)
        }
    }, [userGeneralData, isOwnProfile])

    useEffect(() => {
        if(userStatsData && userStatsData.getUserStats){
            setUserStats(userStatsData.getUserStats)
        }
    }, [userStatsData])

    useEffect(() => {
        if(!isOwnProfile && followStateData && followStateData.getFollowState){
            setIsFollowed(followStateData.getFollowState.isFollowed)
        }
    }, [followStateData, isOwnProfile])

    useEffect(() => {
        if (userSocialMediaData && userSocialMediaData.getUserSocialMedia) {
            setUserSocialMedia(userSocialMediaData.getUserSocialMedia)
        }
    }, [userSocialMediaData, isOwnProfile]);

    useEffect(() => {
        if (userArtworksData && userArtworksData.getUserArtworks) {
            if(!isOwnProfile){
                const restrictedIds = [1, 3 ,4]
                const filterArtworks = userArtworksData.getUserArtworks.filter((artwork) => !restrictedIds.includes(artwork.publishingId))
                
                setArtworks(filterArtworks)
            }else{
                setArtworks(userArtworksData.getUserArtworks)
            }

            setLoading(false)
        }
    }, [userArtworksData, isOwnProfile]);

    useEffect(() => {
        if (data && data.newArtwork) {
            const newArtwork = data.newArtwork.artwork;
            setArtworks((prevArtworks) => [...prevArtworks, newArtwork]);
        }
    }, [data]);

    const handleNavigateSettings = () => {
        if (user && isOwnProfile) {
            const encodedUserId = encodeToBase64(user.userId);
            const encodedModule = encodeToBase64('ProfileSettings');

            const safeUserId = encodeURIComponent(encodedUserId);
            const safeModule = encodeURIComponent(encodedModule);
            
            navigate(`/ProfileSettings/${safeUserId}/${safeModule}`)
        }
    }

    const handleNavigateNewArt = () => {
        if(user && isOwnProfile){
            const encodedUserId = encodeToBase64(user.userId);
            const encodedModule = encodeToBase64('NewArtwork');

            const safeUserId = encodeURIComponent(encodedUserId);
            const safeModule = encodeURIComponent(encodedModule);

            navigate(`/ArtWorks/New/${safeUserId}/${safeModule}`)
        }
    }

    const handleMenuOpen = (artworkId: number | undefined) => {
        setOpenMenuId(artworkId);
    };

    const handleFollowState = (state: boolean) => {
        if(!isOwnProfile && user && userData){
            const data = {
                followedId: userData.userId,
                simple: true
            }
    
            if(state){
                setIsFollowed(true)
                setFollowState(data)
            }else{
                unsetFollowState(data)
                setIsFollowed(false)
            }
        }
    }

    const deleteArtworks = (artworkIds: number[]) => {
        if(user && isOwnProfile && artworkIds.length > 0){
            const deleteArtworks = {
                artworkIds: artworkIds,
            };
            deleteUserArtworks(deleteArtworks)

            setArtworks(prev => prev.filter(artwork => !artworkIds.includes(artwork.artworkId)));
        }
    }

    return (
        <Show
            when={!userSocialMediaLoading && !userArtworksLoading && !loading}
            fallback={
                <LoadingProgress />
            }
        >
            <Box w={"auto"} h={"auto"}>
                <Grid
                    templateColumns={isUserInfoVisible ? "1fr 4fr" : "1fr"}
                    w={"full"}
                    gap={5}
                    alignItems={"start"}
                >
                    <ArtistSidebar
                        isSummaryExpanded = {isSummaryExpanded}
                        onToggleSummary={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                        isUserInfoVisible = {isUserInfoVisible}
                        onToggleVisible={() => setIsUserInfoVisible(!isUserInfoVisible)} 
                        isOwnProfile = {isOwnProfile}
                        userSocialMedia = {userSocialMedia}
                        shouldExpand = {shouldExpand}
                        userData = {userData}
                        userStats = {userStats}
                        isFollowed = {isFollowed}
                        user = {user}
                        truncatedSummary = {truncatedSummary}
                        onFollow = {handleFollowState}
                        goSettings = {handleNavigateSettings}
                    />
                    
                    <ArtistContent
                        artworks = {artworks}
                        isOwnProfile = {isOwnProfile}
                        isUserInfoVisible = {isUserInfoVisible}
                        openMenuId = {openMenuId}
                        onMenuOpen = {handleMenuOpen}
                        onNewArt = {handleNavigateNewArt}
                        onDelete={deleteArtworks}
                    />
                </Grid>
                <Flex>
                    <Show when={!isUserInfoVisible}>
                        <Tooltip
                            content="Unhide Profile"
                            openDelay={200}
                            closeDelay={100}
                            unmountOnExit={true}
                            lazyMount={true}
                            positioning={{ placement: 'top-end' }}
                            showArrow
                            contentProps={{
                                css: {
                                    '--tooltip-bg': colorMode === 'light' ? 'colors.teal.400' : 'colors.pink.600',
                                    'color': 'white',
                                },
                            }}
                        >
                            <IconButton
                                position="fixed"
                                aria-label="Show Info"
                                onClick={() => setIsUserInfoVisible(true)}
                                size="lg"
                                colorScheme="black"
                                shadow="md"
                                borderRadius="full"
                                bg={colorMode === "light" ? "black" : "white"}
                                color={colorMode === "light" ? "pink.600" : "teal.400"}
                                left="20px"
                                bottom="75px"
                                zIndex="tooltip"
                            >
                                <IoEye />
                            </IconButton>
                        </Tooltip>
                    </Show>
                </Flex>
            </Box>
        </Show>
    )
}

export default Profile;