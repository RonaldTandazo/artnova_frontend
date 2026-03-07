export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string
    location: string | undefined; 
    telephone: string | undefined
    professionalHeadline: string | undefined;
    summary: string | undefined;
    since: string;
    countryId: number | null
    city: string | undefined;
    avatar: string | undefined;
}

// OPTIONS
export interface SelectOptions {
    value: number | string;
    label: string;
}

// COUNTRY
export interface GetCountries {
    getCountries: Country[]
}

export interface Country {
    countryId: number;
    name: string;
}

// PUBLISHING
export interface Publishing {
    publishingId: number
    name: string
    type: string
}

// NOTIFICATION
export interface Notification {
    message: string;
    type: "error" | "success" | undefined;
}