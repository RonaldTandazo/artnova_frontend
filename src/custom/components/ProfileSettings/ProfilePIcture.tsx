import { Box, GridItem, Icon, Image, Show, Stack, Text } from "@chakra-ui/react";
import LoadingProgress from "../States/LoadingProgress";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { useStoreUserPicture } from "@/services/User/UserService";
import { ProfilePictureProps } from "@/custom/interfaces/ProfileSettings/ProfilePIcture";
import MultimediaDialog from "../Dialogs/MultimediaDialog";
import { Notification } from "@/custom/interfaces/General/GeneralInterfaces";
import { BACKEND_URL, convertBase64ToFile, DATE_OPTIONS } from "@/utils/Helpers";
import { ImUser } from "react-icons/im";
import { FaCamera } from "react-icons/fa";

const ProfilePicture = ({user, resetAlert, handleNotification, updateUser}: ProfilePictureProps) => {
    const { colorMode } = useColorMode();
    const [since, setSince] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [imageType, setImageType] = useState<'avatar' | 'cover' | undefined>(undefined);
    const [fileURL, setFileURL] = useState<string | undefined>(undefined)
    
    const { storeUserPicture, error: storeUserPictureError, loading: storeUserPictureLoading } = useStoreUserPicture();

    useEffect(() => {
        if (user?.since) {
            const fecha = new Date(user.since);
            setSince(fecha.toLocaleDateString('en-US', DATE_OPTIONS));
        }
    }, [user]);

    useEffect(() => {
        if (storeUserPictureError?.message) {
            const notification: Notification = {
                message: storeUserPictureError?.message,
                type: "error"
            };
            handleNotification(notification);
        }
    
    }, [storeUserPictureError]);

    // PICTURE UPDATE
    const handleImageClick = (type: 'avatar' | 'cover') => {
        if(type == 'avatar'){
            fileInputRef.current?.click();
        }else{
            coverInputRef.current?.click()
        }

        setImageType(type);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        resetAlert();

        const file = e.target.files?.[0]
        if (!file) return null

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            const notification: Notification = {
                message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
                type: 'error'
            }
            handleNotification(notification);

            return;
        }
        
        if (file.size > maxSize) {
            const notification: Notification = {
                message: 'File size exceeds the limit of 5MB',
                type: 'error'
            }
            handleNotification(notification)
            
            return;
        }
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setFileURL(reader.result?.toString() || '');
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleComplete = async (file: string) => {
        setIsModalOpen(false);
        const convertedFile = convertBase64ToFile(file, `cropped-image-${Date.now()}.jpg`);
        const response = await storeUserPicture({type: imageType, picture: convertedFile})
        if(response?.data){
            const storeUserPictureData = response?.data;
            const updatedUser: any = imageType == 'avatar' ? { ...user, avatar: storeUserPictureData.storeUserPicture.value }:{ ...user, cover: storeUserPictureData.storeUserPicture.value };
            updateUser(updatedUser);
            
            const notificationValue: Notification = {
                message: storeUserPictureData.storeUserPicture.label,
                type: 'success'
            };
            handleNotification(notificationValue);
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFileURL(undefined);
        setImageType(undefined);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        if(coverInputRef.current){
            coverInputRef.current.value = '';
        }
    };

    return (
        <>
            <GridItem 
                h={"100%"} 
                position="relative"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="250px"
                    borderRadius="sm"
                    bgGradient={!user?.cover ? "to-br" : undefined}
                    gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                    gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                    bg={!user?.cover ? undefined : (colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100')}
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => handleImageClick('cover')}
                    _hover={{ opacity: 0.9 }}
                    transition="all 0.2s"
                >
                    <Show
                        when={user?.cover}
                        fallback={
                            <Box 
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                h="full"
                                opacity={0.5}
                            >
                                <Icon as={FaCamera} mr={2} />
                                <Text fontSize="xs">Click to change cover</Text>
                            </Box>
                        }
                    >
                        <Image 
                            src={`${BACKEND_URL}/covers/${user?.cover}`} 
                            w="full" 
                            h="full"
                            objectFit="cover" 
                        />
                    </Show>
                </Box>

                <Stack 
                    align="center" 
                    mt="150px"
                    position="relative" 
                    zIndex={2}
                >
                    <Box 
                        p={2}
                        bg={colorMode === "light" ? "white" : "black"} 
                        borderRadius="full"
                        onClick={() => handleImageClick('avatar')}
                    >
                        <Show
                            when={user && !storeUserPictureLoading}
                            fallback={
                                <LoadingProgress/>
                            }
                        >
                            <Show
                                when={user && user.avatar}
                                fallback={
                                    <Icon
                                        as={ImUser}
                                        boxSize="200px"
                                        color={colorMode === 'light' ? 'teal.100' : 'pink.100'}
                                        bgGradient={"to-br"}
                                        gradientFrom={colorMode === 'light' ? "purple.500":"pink.700"} 
                                        gradientTo={colorMode === 'light' ? "teal.400":"cyan.900"}
                                        rounded={'full'}
                                        cursor="pointer"
                                        _hover={{ opacity: 0.7 }}
                                    />
                                }
                            >
                                <Image
                                    src={`${BACKEND_URL}/avatars/${user?.avatar}`}
                                    alt="Profile Picture"
                                    boxSize="200px"
                                    borderRadius="full"
                                    fit="cover"
                                    cursor="pointer"
                                    border="4px solid"
                                    borderColor={colorMode === 'light' ? 'teal.400' : 'pink.600'}
                                    _hover={{ opacity: 0.7 }}
                                />
                            </Show>
                        </Show>
                    </Box>
                    
                    <Box 
                        my={5}
                        textAlign="center"
                    >
                        <Text 
                            fontSize={"2xl"}
                            fontWeight={"extrabold"}
                        >
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text 
                            fontSize={"xl"}
                        >
                            {user?.username}
                        </Text>
                        <Text fontSize={"sm"} mt={4} opacity={0.8}>Member since {since}</Text>
                    </Box>
                </Stack>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={coverInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </GridItem>

            <MultimediaDialog 
                isOpen={isModalOpen}
                type={"images"}
                fileURL={fileURL}
                aspectRatio={imageType == 'avatar' ? 1/1:16/9}
                onComplete={handleComplete}
                onClose={handleClose}
            />
        </>
    );
}

export default ProfilePicture;