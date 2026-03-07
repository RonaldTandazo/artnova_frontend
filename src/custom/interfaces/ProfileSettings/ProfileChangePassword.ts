import { Notification } from "../general/GeneralInterfaces";

export interface ProfileChangePasswordProps{
    resetAlert: () => void; 
    handleNotification: (notification: Notification) => void
}

export interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}