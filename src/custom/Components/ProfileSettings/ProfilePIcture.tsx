import { Box, GridItem, Icon, Image, Show, Stack, Text } from "@chakra-ui/react";
import LoadingProgress from "../States/LoadingProgress";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { useStoreUserPicture } from "@/services/User/UserService";
import { ProfilePictureProps } from "@/custom/interfaces/ProfileSettings/ProfilePIcture";
import MultimediaDialog from "../Dialogs/MultimediaDialog";
import { Notification } from "@/custom/interfaces/general/GeneralInterfaces";
import { BACKEND_URL, convertBase64ToFile, DATE_OPTIONS } from "@/utils/Helpers";
import { ImUser } from "react-icons/im";

const ProfilePicture = ({user, resetAlert, handleNotification, updateUser}: ProfilePictureProps) => {
    const { colorMode } = useColorMode();
    const [since, setSince] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { storeUserPicture, error: storeUserPictureError, loading: storeUserPictureLoading } = useStoreUserPicture();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [fileURL, setFileURL] = useState<string | undefined>(undefined)

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
    const handleImageClick = () => {
        fileInputRef.current?.click();
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
        const response = await storeUserPicture(convertedFile)
        if(response?.data){
            const storeUserPictureData = response?.data;
            const updatedUser: any = { ...user, avatar: storeUserPictureData.storeUserPicture.value };
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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <GridItem display="flex" justifyContent="center" alignItems="center" h={"100%"}>
                <Stack>
                    <Box 
                        w="100%"
                        display={"flex"}
                        justifyContent="center" 
                        alignItems="center"
                        onClick={handleImageClick}
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
                                        boxSize="400px"
                                        color={colorMode === 'light' ? 'cyan.100' : 'pink.100'}
                                        bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                                        rounded={'full'}
                                        cursor="pointer"
                                    />
                                }
                            >
                                <Image
                                    src={`${BACKEND_URL}/avatars/${user?.avatar}`}
                                    alt="Stored Image"
                                    boxSize="400px"
                                    borderRadius="full"
                                    fit="cover"
                                    cursor="pointer"
                                />
                            </Show>
                        </Show>
                    </Box>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Box 
                        w="100%"
                        my={5}
                    >
                        <Text fontSize={"2xl"} justifySelf={"center"} textAlign={"center"} fontWeight={"extrabold"}>{user?.firstName} {user?.lastName}</Text>
                        <Text fontSize={"xl"} justifySelf={"center"} textAlign={"center"}>{user?.username}</Text>
                    </Box>
                    <Box 
                        w="100%"
                    >
                        <Text fontSize={"lg"} justifySelf={"center"} textAlign={"center"}>Member since {since}</Text>
                    </Box>
                </Stack>
            </GridItem>

            <MultimediaDialog isOpen={isModalOpen} type={"images"} fileURL={fileURL} aspectRatio={1/1} onComplete={handleComplete} onClose={handleClose}/>
        </>
    );
}

export default ProfilePicture;