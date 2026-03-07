import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { STORE_USER_SKILLS } from "@/graphql/UserSkills/UserSkillsMutations";
import { GET_SKILLS_DATA, GET_USER_SKILLS } from "@/graphql/UserSkills/UserSkillsQueries";
import { GetSkillsData, GetUserSkills } from "@/custom/interfaces/ProfileSettings/ProfileSkillsInterests";

export const useGetSkillsData = () => {
    const [getSkillsData, { loading, data, error }] = useLazyQuery<GetSkillsData>(GET_SKILLS_DATA)

    const GetSkillsData = async () => {
        try {
            await getSkillsData();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getSkillsData: GetSkillsData,
        data,
        loading,
        error,
    };
}

export const useGetUserSkills = () => {
    const [getUserSkills, { loading, data, error }] = useLazyQuery<GetUserSkills>(GET_USER_SKILLS)

    const GetUserSkills = async () => {
        try {
            await getUserSkills();
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        getUserSkills: GetUserSkills,
        data,
        loading,
        error,
    };
}

export const useStoreUserSkills= () => {
    const [storeUserSkillsMutation, { data, loading, error }] = useMutation(STORE_USER_SKILLS/*, {
        refetchQueries: [{ query: GET_USER_SKILLS, context: { requireAuth: true } }],
    }*/);

    const storeUserSkills = async (userSkillsData: any) => {
        try {
            return await storeUserSkillsMutation({ 
                variables: { userSkillsData }
            });
        } catch (err) {
            if (err instanceof CombinedGraphQLErrors) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserSkills,
        data,
        loading,
        error,
    };
};