import { GeneralInfoInterface } from "@/graphql/User/UserInterfaces"
import { User } from "../general/GeneralInterfaces"

export interface ArtistMessageProps {
    artist: GeneralInfoInterface | undefined;
    user: User | undefined;
    openChat: boolean;
    onToggleChat: () => void;
}