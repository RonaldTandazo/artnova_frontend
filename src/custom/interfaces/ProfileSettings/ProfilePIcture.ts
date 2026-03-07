import { Notification, User } from "../general/GeneralInterfaces";

export interface ProfilePictureProps {
    user: User | undefined;
    resetAlert: () => void;
    handleNotification: (notification: Notification) => void;
    updateUser: (newUser: any) => void;
};