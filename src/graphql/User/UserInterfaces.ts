import { User } from "@/custom/interfaces/general/GeneralInterfaces"
import { ProfileFormValues } from "@/custom/interfaces/ProfileSettings/ProfileInformation"

export interface UserVariablesInterface {
    userId?: number | null
    module?: string | null
}

export interface GeneralInfoInterface extends User {
    chatId: string | undefined
}

export interface UserGeneralInterface {
    getUserGeneralData: GeneralInfoInterface
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