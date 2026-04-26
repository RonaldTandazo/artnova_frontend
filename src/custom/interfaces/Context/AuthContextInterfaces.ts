import { User } from "../General/GeneralInterfaces";
import { ApolloError } from '@apollo/client';

export interface AuthContextType {
    isAuthenticated: boolean;
    signup: (firstName: string, lastName: string, email: string, username: string, password: string) => Promise<void>;
    login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
    updateUser: (newUser: User) => void;
    token: string | null;
    user: User | undefined;
    loading: boolean;
    error: null | ApolloError;
    clearError: () => void;
}