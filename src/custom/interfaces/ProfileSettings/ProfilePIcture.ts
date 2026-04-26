import { Notification, User } from "../General/GeneralInterfaces";

export interface ProfilePictureProps {
    user: User;
    resetAlert: () => void;
    handleNotification: (notification: Notification) => void;
    updateUser: (newUser: User) => void;
};