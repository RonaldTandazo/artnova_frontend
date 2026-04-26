import { User } from "../General/GeneralInterfaces";

export interface AccountTriggerProps {
    user: User;
    logout: () => void;
    navigateTo: (module: string, route: string | null) => void;
}