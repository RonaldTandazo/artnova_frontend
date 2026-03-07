import { GeneralInfoInterface } from "@/graphql/User/UserInterfaces"
import { User } from "../general/GeneralInterfaces"
import { UserSocialMedia } from "../ProfileSettings/ProfileSocialMedia";

export interface ArtistSidebarProps {
    isSummaryExpanded: boolean;
    onToggleSummary: () => void;
    isUserInfoVisible: boolean;
    onToggleVisible: () => void;
    isOwnProfile: boolean;
    userSocialMedia: UserSocialMedia[] | undefined;
    shouldExpand: boolean;
    userData: GeneralInfoInterface | undefined;
    isFollowed: boolean;
    user: User | undefined;
    truncatedSummary: string | undefined;
    onFollow: (state: boolean) => void;
    goSettings: () => void;
}