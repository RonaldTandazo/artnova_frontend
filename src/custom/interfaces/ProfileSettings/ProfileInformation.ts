import { Notification, SelectOptions, User } from "../General/GeneralInterfaces";

export interface ProfileInformationProps{
    user: User | undefined;
    countryLoading: boolean;
    countries: SelectOptions[];
    resetAlert: () => void; 
    handleNotification: (notification: Notification) => void
    updateUser: (newUser: any) => void;
}

export interface ProfileFormValues {
    firstName: string;
    lastName: string;
    professionalHeadline: string;
    summary: string;
    countryId: number;
    city: string;
}