import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from "@apollo/client/react";
import { GET_SOCIAL_MEDIA } from '@/graphql/SocialMedia/SocialMediaQueries';
import { GetSocialMedia } from '@/custom/interfaces/ProfileSettings/ProfileSocialMedia';

export const useGetSocialMedia = () => {
    const [getSocialMedia, { data, loading, error }] = useLazyQuery<GetSocialMedia>(GET_SOCIAL_MEDIA);

    const GetSocialMedia = async () => {
        try {
            await getSocialMedia();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getSocialMedia: GetSocialMedia,
        data,
        loading,
        error,
    };
};