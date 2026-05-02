import { User, UserStats } from "@/custom/interfaces/General/GeneralInterfaces"
import { ProfileFormValues } from "@/custom/interfaces/ProfileSettings/ProfileInformation"

export interface GeneralInfoInterface extends User {
    chatId: string | undefined
}

export interface UserGeneralInterface {
    getUserGeneralData: GeneralInfoInterface
}

export interface GetUserStats {
    getUserStats: UserStats
}

export interface ProfileUpdatePayload {
    profileUpdate: {
        message: string
        values: ProfileFormValues
    }
}

export interface StoreUserPicture {
    storeUserPicture: {
        label: string
        value: string
    }
}