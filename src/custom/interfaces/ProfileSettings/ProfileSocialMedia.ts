import { Notification, SelectOptions } from "../General/GeneralInterfaces";

export interface ProfileSocialMediaProps {
    socialMedia: SelectOptions[];
    socialMediaLoading: boolean;
    resetAlert: () => void; 
    handleNotification: (notification: Notification) => void
}

export interface SocialMediaFormValues {
    socialMediaId: number;
    link: string;
}

export interface GetUserSocialMedia {
    getUserSocialMedia: UserSocialMedia[]
}

export interface UserSocialMedia {
    userSocialNetworkId: number
    socialMediaId: number
    network: string
    link: string
}

export interface SocialMediaItemProps {
    item: UserSocialMedia;
    socialMedia: SelectOptions[];
    socialMediaLoading: boolean;
    onUpdate: (id: number, socialMediaId: number, link: string) => void
    onDelete: (id: number) => void
}

export interface GetSocialMedia {
    getSocialMedia: SocialMediaInterface[];
}

export interface SocialMediaInterface {
    socialMediaId: number;
    name: string
}

export interface IconsProps {
    socialNetwork: string;
    link: string;
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}