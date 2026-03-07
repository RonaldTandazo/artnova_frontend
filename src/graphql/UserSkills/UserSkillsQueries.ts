import { gql } from '@apollo/client/core';

export const GET_SKILLS_DATA = gql`    
    query GetSkillsData{ 
        getSkillsData{
            categories{
                categoryId
                name
            }
            topics{
                topicId
                name
            }
            softwares{
                softwareId
                name
            }
        }
    }
`;

export const GET_USER_SKILLS = gql`    
    query GetUserSkills{ 
        getUserSkills{
            userCategories{
                userId
                categoryId
                name
            }
            userTopics{
                userId
                topicId
                name
            }
            userSoftwares{
                userId
                softwareId
                name
            }
        }
    }
`;