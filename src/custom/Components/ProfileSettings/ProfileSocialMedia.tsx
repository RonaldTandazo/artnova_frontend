import { Box, Button, Field, Flex, For, Heading, Input, Show, Stack, Text } from "@chakra-ui/react";
import { IoIosSave } from "react-icons/io";
import LoadingProgress from "../States/LoadingProgress";
import { SocialMediaFormValues, ProfileSocialMediaProps, UserSocialMedia,  } from "@/custom/interfaces/ProfileSettings/ProfileSocialMedia";
import { useGetUserSocialMedia, useRemoveUserSocialNetowrk, useStoreUserSocialNetowrk, useUpdateUserSocialNetowrk } from "@/services/UserSocialNetwork/UserSocialNetworkService";
import { Controller, useForm } from "react-hook-form";
import { Notification } from "@/custom/interfaces/general/GeneralInterfaces";
import SearchableSelect from "../Searchable/SearchableSelect";
import SocialMediaListItem from "../SocialMedia/SocialMediaListItem";
import { useEffect, useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";

const ProfileSocialMedia = ({socialMedia, socialMediaLoading, resetAlert, handleNotification}: ProfileSocialMediaProps) => {
    const { colorMode } = useColorMode();
    const [userSocialMedia, setUserSocialMedia] = useState<UserSocialMedia[]>([]);
    
    const { getUserSocialMedia, data: userSocialMediaData, loading: userSocialMediaLoading } = useGetUserSocialMedia();
    const { storeUserNetwork, error: storeUserNetworkError, loading: storeUserNetworkLoading } = useStoreUserSocialNetowrk();
    const { updateUserNetwork: UpdateUserNetwork, error: updateUserError } = useUpdateUserSocialNetowrk();
    const { removeUserNetwork: RemoveUserNetwork, error: removeUserNetworkError } = useRemoveUserSocialNetowrk();

    useEffect(() => {
        getUserSocialMedia({userId: null, module: null});
    }, []);

    useEffect(() => {
        if(userSocialMediaData?.getUserSocialMedia){
            setUserSocialMedia(userSocialMediaData.getUserSocialMedia)
        }
    }, [userSocialMediaData]);

    useEffect(() => {
        if(storeUserNetworkError?.message){
            const notification: Notification = {
                message: storeUserNetworkError?.message,
                type: "error"
            };
            handleNotification(notification);
        }
    
    }, [storeUserNetworkError]);

    useEffect(() => {
        if(removeUserNetworkError?.message){
            const notification: Notification = {
                message: removeUserNetworkError?.message,
                type: "error"
            };
            handleNotification(notification);
        }
    
    }, [removeUserNetworkError]);

    useEffect(() => {
        if(updateUserError?.message){
            const notification: Notification = {
                message: updateUserError?.message,
                type: "error"
            };
            handleNotification(notification);
        }
    
    }, [updateUserError]);

    const {
        register: registerSocialMedia,
        handleSubmit: handleSocialMedia,
        formState: { errors: errorsSocialeMedia },
        control: socialMediaControl
    } = useForm<SocialMediaFormValues>();

    const onSubmitSocialMedia = handleSocialMedia(async (data: any) => {
        resetAlert();
        
        const response = await storeUserNetwork(data.socialMediaId[0], data.link)
        if(response?.data){
            socialMediaControl._reset();

            const storeUserNetworkData = response?.data;
            const notification: Notification = {
                message: Object.values(storeUserNetworkData).find(value => value !== undefined),
                type: 'success'
            };
            handleNotification(notification)
        }
    });

    const onRemoveSocialMedia = async (userSocialMediaId: number) => {
        resetAlert();

        const previusState = [...userSocialMedia];

        setUserSocialMedia(prev => prev.filter(record => userSocialMediaId != record.userSocialNetworkId));

        const response = await RemoveUserNetwork(userSocialMediaId);
        if(response?.data){
            const udate = response?.data;
            const notification: Notification = {
                message: Object.values(udate).find(value => value !== undefined),
                type: 'success'
            };
            handleNotification(notification)
        }else{
            setUserSocialMedia(previusState)
        }
    }

    const onUpdateSocialMedia = async(userSocialMediaId: number, socialMediaId: number, link: string) => {
        resetAlert();

        const previusState = [...userSocialMedia];

        setUserSocialMedia(prev =>
            prev.map(record =>
                record.userSocialNetworkId === userSocialMediaId
                ? { ...record, socialMediaId, link }
                : record
            )
        );

        const response = await UpdateUserNetwork(userSocialMediaId, socialMediaId, link);
        if(response?.data){
            const udate = response?.data;
            const notification: Notification = {
                message: Object.values(udate).find(value => value !== undefined),
                type: 'success'
            };
            handleNotification(notification)
        }else{
            setUserSocialMedia(previusState)
        }
    }

    return (
        <Show
            when={!socialMediaLoading && !userSocialMediaLoading}
            fallback={
                <LoadingProgress/>
            }
        >
            <Stack p={7}>
                <Box w={"full"}>
                    <Box w={"full"} mb={3}>
                        <Heading size="3xl">Social Media</Heading>
                    </Box>
                    <Box w={"full"} mb={10}>
                        <Heading size="lg">Share your Contact & Social Media links</Heading>
                    </Box>
                </Box>
                <Show 
                    when={socialMedia.length > 0}
                    fallback={
                        <label>
                            Ooops...Please try it later!
                        </label>
                    }
                >
                    <form onSubmit={onSubmitSocialMedia}>
                        <Stack gap={5}>
                            <Flex direction={"row"} gap={5} w={"full"} alignItems={"center"}>
                                <Field.Root invalid={!!errorsSocialeMedia.socialMediaId} w={"15vw"}>
                                    <Field.Label>Social Network</Field.Label>
                                    <Controller
                                        control={socialMediaControl}
                                        name="socialMediaId"
                                        rules={{ required: "Social Network is required" }}
                                        render={({ field }) => (
                                            <SearchableSelect disabled={socialMediaLoading} placeholder={"Select Social Netowrk"} options={socialMedia} field={field} multiple={false}/>
                                        )}
                                    />
                                    <Field.ErrorText>{errorsSocialeMedia.socialMediaId?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errorsSocialeMedia.link}>
                                    <Field.Label>Link</Field.Label>
                                    <Input {...registerSocialMedia("link", { required: "Link is required" })}/>
                                    <Field.ErrorText>{errorsSocialeMedia.link?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>
                            
                            <Button
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={colorMode === 'light' ? "cyan.600":"pink.600"}  
                                color={"white"}
                                loading={storeUserNetworkLoading}
                                disabled={storeUserNetworkLoading}
                            >
                                <IoIosSave />Save
                            </Button>

                            <Box w={"full"} display={userSocialMediaLoading || storeUserNetworkLoading ? "flex":"inline"} justifyContent={userSocialMediaLoading || storeUserNetworkLoading  ? "center":"start"}>
                                <Show
                                    when={userSocialMedia.length > 0}
                                    fallback={
                                        <Show
                                            when={userSocialMediaLoading || storeUserNetworkLoading}
                                        >
                                            <LoadingProgress />
                                        </Show>
                                    }
                                >
                                    <Stack gap={5}>
                                        <Text fontSize={"2xl"} fontWeight="bold" my={5}>Added Social Media</Text>
                                        <For
                                            each={userSocialMedia}
                                        >
                                            {(item) => {
                                                return (
                                                    <SocialMediaListItem
                                                        key={item.userSocialNetworkId}
                                                        item={item} 
                                                        socialMedia={socialMedia}
                                                        socialMediaLoading={socialMediaLoading}
                                                        onUpdate={onUpdateSocialMedia}
                                                        onDelete={onRemoveSocialMedia}
                                                    />
                                                )
                                            }}
                                        </For>
                                    </Stack>
                                </Show>
                            </Box>
                        </Stack>
                    </form>
                </Show>
            </Stack>
        </Show>
    )
};

export default ProfileSocialMedia;