export interface LoginInterface {
    login: {
        accessToken: string
        refreshToken: string
        type: string
    }
}

export interface ValidateAccessInput {
    value: number | null
    module: string
}

export interface ValidateAccessInterface {
    validateUserAccess: {
        validate: boolean
    }
}