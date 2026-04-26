import { User } from "../General/GeneralInterfaces";
import { ArtworkComment } from "./ArtworkView";

export interface PostingCommentsProps {
    user: User | undefined;
    comments: ArtworkComment[];
    statsLoading: boolean; 
    postLoading: boolean;
    postComment: (comment: string) => void;
    deleteComment: (commentIds: string[]) => void;
    onLike: (commentId: string) => void;
    onDislike: (commentId: string) => void;
    toProfile: (userId: number | undefined) => string;
};