import { Notification, SelectOptions } from "../general/GeneralInterfaces";

export interface ProfileSkillsInterestsProps {
    skillsLoading: boolean;
    categories: SelectOptions[];
    topics: SelectOptions[];
    softwares: SelectOptions[];
    resetAlert: () => void; 
    handleNotification: (notification: Notification) => void
}

// SKILLS
export interface GetSkillsData {
    getSkillsData: {
        categories: Category[];
        topics: Topic[];
        softwares: Software[];
    }
}

// CATEGORY
export interface Category {
    categoryId: number;
    name: string;
}

// TOPIC
export interface Topic {
    topicId: number;
    name: string;
}

// SOFTWARE
export interface Software {
    softwareId: number;
    name: string;
}

export interface GetUserSkills {
    getUserSkills: {
        userCategories: Category[];
        userSoftwares: Software[];
        userTopics: Topic[];
    }
}
