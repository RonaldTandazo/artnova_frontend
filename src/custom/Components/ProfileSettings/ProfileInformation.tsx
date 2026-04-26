import { Box, Button, Field, Flex, Heading, Input, Show, Stack, Textarea } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import SearchableSelect from "../Searchable/SearchableSelect";
import { IoIosSave } from "react-icons/io";
import { ProfileFormValues, ProfileInformationProps } from "@/custom/interfaces/ProfileSettings/ProfileInformation";
import { useProfileUpdate } from "@/services/User/UserService";
import { useEffect } from "react";
import { Notification } from "@/custom/interfaces/General/GeneralInterfaces";
import LoadingProgress from "../States/LoadingProgress";
import { useColorMode } from "@/components/ui/color-mode";

const ProfileInformation = ({user, countryLoading, countries, resetAlert, handleNotification, updateUser}: ProfileInformationProps) => {
    const { colorMode } = useColorMode();
    const { profileUpdate, error: profileError, loading: profileLoading } = useProfileUpdate();

    useEffect(() => {
        if(profileError?.message){
            const notification: Notification = {
                message: profileError?.message,
                type: "error"
            }
            handleNotification(notification);
        }

    }, [profileError]);
    
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile },
        control: profileControl
    } = useForm<ProfileFormValues>();

    const onSubmitProfile = handleSubmitProfile(async (data: any) => {
        resetAlert();

        const response = await profileUpdate(data.firstName, data.lastName, data.professionalHeadline, data.summary, data.city, data.countryId[0])
        if(response?.data?.profileUpdate){
            const profileData = response.data;
            const updatedUser: any = {
                ...user, 
                firstName: profileData.profileUpdate.values.firstName, 
                lastName: profileData.profileUpdate.values.lastName, 
                summary: profileData.profileUpdate.values.summary, 
                professionalHeadline: profileData.profileUpdate.values.professionalHeadline,
                countryId: profileData.profileUpdate.values.countryId,
                city: profileData.profileUpdate.values.city
            };
            updateUser(updatedUser);
    
            const notification: Notification = {
                message: profileData.profileUpdate.message,
                type: "success"
            };
            handleNotification(notification)
        }
    });

    return (
        <Show
            when={!countryLoading}
            fallback={
                <LoadingProgress />
            }
        >
            <Stack p={7}>
                <Box w={"full"}>
                    <Box w={"full"} mb={3}>
                        <Heading size="3xl">Profile Information</Heading>
                    </Box>
                    <Box w={"full"} mb={10}>
                        <Heading size="lg">Fill in your basic information</Heading>
                    </Box>
                </Box>
                <form onSubmit={onSubmitProfile}>
                    <Stack gap={5}>
                        <Flex direction={"row"} gap={5}>
                            <Field.Root invalid={!!errorsProfile.firstName}>
                                <Field.Label>First Name</Field.Label>
                                <Input {...registerProfile("firstName", { required: "First Name is required" })} defaultValue={user?.firstName ?? undefined}/>
                                <Field.ErrorText>{errorsProfile.firstName?.message}</Field.ErrorText>
                            </Field.Root>
                            <Field.Root invalid={!!errorsProfile.lastName}>
                                <Field.Label>Last Name</Field.Label>
                                <Input {...registerProfile("lastName", { required: "Last Name is required" })} defaultValue={user?.lastName ?? undefined}/>
                                <Field.ErrorText>{errorsProfile.lastName?.message}</Field.ErrorText>
                            </Field.Root>
                        </Flex>

                        <Flex direction={"row"}>
                            <Field.Root invalid={!!errorsProfile.professionalHeadline}>
                                <Field.Label>Professional Headline</Field.Label>
                                <Input {...registerProfile("professionalHeadline", { required: "Professional Headline is required" })} defaultValue={user?.professionalHeadline ?? undefined}/>
                                <Field.ErrorText>{errorsProfile.professionalHeadline?.message}</Field.ErrorText>
                            </Field.Root>
                        </Flex>

                        <Flex direction={"row"}>
                            <Field.Root invalid={!!errorsProfile.summary}>
                                <Field.Label>Summary</Field.Label>
                                <Textarea {...registerProfile("summary")} defaultValue={user?.summary ?? undefined} h={"3lh"}/>
                                <Field.ErrorText>{errorsProfile.summary?.message}</Field.ErrorText>
                            </Field.Root>
                        </Flex>

                        <Show
                            when={countries.length > 0}
                        >
                            <Flex direction={"row"} gap={5}>
                                <Field.Root invalid={!!errorsProfile.countryId}>
                                    <Field.Label>Country</Field.Label>
                                    <Controller
                                        control={profileControl}
                                        name="countryId"
                                        // rules={{ required: "Country is required" }}
                                        render={({ field }) => (
                                            <SearchableSelect disabled={countryLoading} placeholder={"Select your Country"} options={countries} field={field} multiple={false} defaultValue={user?.countryId ?? undefined}/>
                                        )}
                                    />
                                    <Field.ErrorText>{errorsProfile.countryId?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errorsProfile.city}>
                                    <Field.Label>City</Field.Label>
                                    <Input {...registerProfile("city"/*, { required: "City is required" }*/)} defaultValue={user?.city ?? undefined}/>
                                    <Field.ErrorText>{errorsProfile.city?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>
                        </Show>

                        <Button
                            type="submit" 
                            alignSelf={"flex-end"} 
                            bg={colorMode === 'light' ? "teal.400":"pink.600"} 
                            color={"white"}
                            loading={profileLoading}
                            disabled={profileLoading}
                        >
                            <IoIosSave />Save
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Show>
    )
};

export default ProfileInformation;