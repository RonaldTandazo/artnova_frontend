import { Box, Button, Field, Heading, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import { useChangePassword } from "@/services/User/UserService";
import { useEffect } from "react";
import { Notification } from "@/custom/interfaces/General/GeneralInterfaces";
import { ProfileChangePasswordProps, PasswordFormValues } from "@/custom/interfaces/ProfileSettings/ProfileChangePassword";
import { PasswordInput } from "@/components/ui/password-input";
import { useColorMode } from "@/components/ui/color-mode";

const ProfileChangePassword = ({resetAlert, handleNotification}: ProfileChangePasswordProps) => {
    const { colorMode } = useColorMode();
    const { changePassword, error: passwordError, loading: passwordLoading } = useChangePassword();

    useEffect(() => {
        if (passwordError?.message) {
            const notification: Notification = {
                message: passwordError?.message,
                type: 'error'
            };
            handleNotification(notification);
        }
    }, [passwordError]);

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword },
        getValues: getValuesPassword,
    } = useForm<PasswordFormValues>();

    const onSubmitPassword = handleSubmitPassword(async (data: any) => {
        resetAlert();

        const response = await changePassword(data.currentPassword, data.newPassword)
        if(response?.data){
            const passwordData = response?.data;
            const notification: Notification = {
                message: Object.values(passwordData).find(value => value !== undefined),
                type: 'success'
            }
            handleNotification(notification);
        }
    });

    return (
        <Stack p={7}>
            <Box w={"full"}>
                <Box w={"full"} mb={3}>
                    <Heading size="3xl">Password</Heading>
                </Box>
                <Box w={"full"} mb={10}>
                    <Heading size="lg">Change your Password</Heading>
                </Box>
            </Box>
            <form onSubmit={onSubmitPassword}>
                <Stack gap={5}>
                    <Field.Root invalid={!!errorsPassword.currentPassword}>
                        <Field.Label>Current Password</Field.Label>
                        <PasswordInput {...registerPassword("currentPassword", { required: "Password is required" })} />
                        <Field.ErrorText>{errorsPassword.currentPassword?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errorsPassword.newPassword}>
                        <Field.Label>New Password</Field.Label>
                        <PasswordInput 
                            {...registerPassword("newPassword", { 
                                required: "New Password is required",
                                validate: value => value === getValuesPassword("confirmPassword") || "Passwords must match"
                            })}
                        />
                        <Field.ErrorText>{errorsPassword.newPassword?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errorsPassword.confirmPassword}>
                        <Field.Label>Confirm Password</Field.Label>
                        <PasswordInput 
                            {...registerPassword("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: value => value === getValuesPassword("newPassword") || "Passwords must match"
                            })}
                        />
                        <Field.ErrorText>{errorsPassword.confirmPassword?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button 
                        type="submit" 
                        alignSelf={"flex-end"} 
                        bg={colorMode === 'light' ? "teal.400":"pink.600"} 
                        color={"white"}
                        loading={passwordLoading}
                        disabled={passwordLoading}
                    >
                        <IoIosSave />Save
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
};

export default ProfileChangePassword;