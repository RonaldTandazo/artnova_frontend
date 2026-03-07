import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Icon, Tabs, Text, Grid, GridItem, For, Show } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ImProfile } from "react-icons/im";
import { RiLockPasswordFill } from "react-icons/ri";
import { PiShareNetworkFill } from "react-icons/pi";
import NotificationAlert from "@/custom/Components/States/NotificationAlert";
import { useGetCountry } from "@/services/Country/CountryService";
import { useGetSocialMedia } from "@/services/SocialMedia/SocialMediaService";
import { GrNodes } from "react-icons/gr";
import { useGetSkillsData } from "@/services/UserSkills/UserSkillService";
import { Notification, SelectOptions } from "@/custom/interfaces/general/GeneralInterfaces";
import ProfileInformation from "@/custom/Components/ProfileSettings/ProfileInformation";
import SkillsInterests from "@/custom/Components/ProfileSettings/ProfileSkillsInterests";
import ProfilePicture from "@/custom/Components/ProfileSettings/ProfilePIcture";
import ProfileSocialMedia from "@/custom/Components/ProfileSettings/ProfileSocialMedia";
import ProfileChangePassword from "@/custom/Components/ProfileSettings/ProfileChangePassword";

const ProfileSettings = () => {
    const { colorMode } = useColorMode();
    const { user, updateUser } = useAuth();

    const [countries, setCountries] = useState<SelectOptions[]>([]);
    const [categories, setCategories] = useState<SelectOptions[]>([]);
    const [topics, setTopics] = useState<SelectOptions[]>([]);
    const [softwares, setSoftwares] = useState<SelectOptions[]>([]);
    const [socialMedia, setSocialMedia] = useState<SelectOptions[]>([]);

    const { getCountries, data: countryData, error: countryError, loading: countryLoading } = useGetCountry();
    const { getSkillsData, data: skillsData, error: skillsError, loading: skillsLoading } = useGetSkillsData();
    const { getSocialMedia, data: socialMediaData, error: socialMediaError, loading: socialMediaLoading } = useGetSocialMedia();
    
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    
    const [activeTab, setActiveTab] = useState<string | null>("1");

    useEffect(() => {
        if(activeTab == "1"){
            getCountries();
        }

        if (activeTab == "2") {
            getSkillsData();
        }

        if (activeTab == "3") {
            getSocialMedia();
        }
    }, [activeTab]);

    useEffect(() => {
        if (countryData?.getCountries) {
            setCountries(
                countryData.getCountries.map((country) => ({
                    value: country.countryId,
                    label: country.name,
                }))
            );
        }
    }, [countryData]);

    useEffect(() => {
        if (skillsData?.getSkillsData) {
            const { categories, softwares, topics } = skillsData.getSkillsData;

            setCategories(
                categories.map((category) => ({
                    value: category.categoryId,
                    label: category.name
                }))
            );

            setTopics(
                topics.map((topic) => ({
                    value: topic.topicId,
                    label: topic.name
                }))
            );

            setSoftwares(
                softwares.map((software) => ({
                    value: software.softwareId,
                    label: software.name
                }))
            );
        }
    }, [skillsData]);

    useEffect(() => {
        if (socialMediaData?.getSocialMedia) {
            setSocialMedia(
                socialMediaData.getSocialMedia.map((network) => ({
                    value: network.socialMediaId,
                    label: network.name,
                }))
            );
        }
    }, [socialMediaData]);

    useEffect(() => {
        let message = '';

        if (countryError?.message) {
            message = countryError?.message;
        }else if (skillsError?.message) {
            message = skillsError?.message;
        }else if(socialMediaError?.message){
            message = socialMediaError?.message;
        }

        if(message != ''){
            handleNotification({message: message, type: 'error'});
        }
    }, [countryError, skillsError, socialMediaError]);

    // NOTIFICATION HANDLER
    const resetAlert = () => {
        setShowNotification(false)
        setNotification(null)
    }

    const handleNotification = (notification: Notification) => {
        setShowNotification(true)
        setNotification({message: notification.message, type: notification.type})
    }
    
    // HANDLE TABS
    const handleTab = (e: any) => {
        setActiveTab(e.value);
        resetAlert()
    };

    const items = [
        {
            index: "1",
            title: "Profile Information",
            icon: <ImProfile />,
            content: (                
                <ProfileInformation
                    user={user}
                    countryLoading={countryLoading}
                    countries={countries}
                    resetAlert={resetAlert}
                    handleNotification={handleNotification}
                    updateUser={updateUser}
                />
            )
        },
        {
            index: "2",
            title: "Skills & Interests",
            icon: <GrNodes />,
            content: (                
                <SkillsInterests
                    skillsLoading={skillsLoading}
                    categories={categories}
                    topics={topics}
                    softwares={softwares}
                    resetAlert={resetAlert}
                    handleNotification={handleNotification}
                />
            )
        },
        {
            index: "3",
            title: "Social Media",
            icon: <PiShareNetworkFill />,
            content: (
                <ProfileSocialMedia
                    socialMedia={socialMedia}
                    socialMediaLoading={socialMediaLoading}
                    resetAlert={resetAlert}
                    handleNotification={handleNotification}
                />
            )
        },
        {
            index: "4",
            title: "Password",
            icon: <RiLockPasswordFill />,
            content: (
                <ProfileChangePassword
                    resetAlert={resetAlert}
                    handleNotification={handleNotification}
                />
            )
        }
    ];

    return (
        <Box
            bg={colorMode === "light" ? "whiteAlpha.950" : "blackAlpha.500"}
            shadow={"lg"}
            rounded={"lg"}
            h={"full"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Grid w={"75vw"} templateColumns="35% 65%" p={10} h={"100%"}>
                <ProfilePicture 
                    user={user}
                    resetAlert={resetAlert}
                    handleNotification={handleNotification}
                    updateUser={updateUser}
                />
                <GridItem h={"100%"}>
                    <Tabs.Root
                        lazyMount
                        unmountOnExit
                        defaultValue="1"
                        orientation="vertical"
                        onValueChange={handleTab}
                        value={activeTab}
                        w={"full"}
                        variant={"plain"}
                        display={"flex"}
                        flexDirection={"row"}
                        h={"100%"}
                    >
                        <Tabs.List p={1} gap={3} overflowX="hidden" w={"25%"}>
                            <For each={items}>
                                {(item) => (
                                    <Tabs.Trigger
                                        key={item.index}
                                        value={item.index}
                                        _selected={{
                                            borderLeft: "4px solid",
                                            borderLeftColor:
                                                colorMode === "light" ? "cyan.600" : "pink.600",
                                            backgroundColor:
                                                colorMode === "light" ? "cyan.50" : "pink.200",
                                            color: "black",
                                        }}
                                        rounded={"xs"}
                                        bg={"none"}
                                    >
                                        <Box
                                            // position={"relative"}
                                            overflow={"hidden"}
                                            whiteSpace={"nowrap"}
                                            display={"flex"}
                                            direction={"row"}
                                            justifyContent={"flex-start"}
                                            alignItems={"center"}
                                            gap={2}
                                            w={"full"}
                                        >
                                            <Icon
                                                size={"md"}
                                                color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                            >
                                                {item.icon}
                                            </Icon>
                                            <Text gap={2} truncate>
                                                {item.title}
                                            </Text>
                                        </Box>
                                    </Tabs.Trigger>
                                )}
                            </For>
                        </Tabs.List>
                        <Box w={"75%"} h={"100%"}>
                            <For
                                each={items}
                            >
                                {(item) => (
                                    <Tabs.Content
                                        key={item.index}
                                        value={item.index}
                                    >
                                        {item.content}
                                    </Tabs.Content>
                                )}
                            </For>
                        </Box>
                    </Tabs.Root>
                </GridItem>
            </Grid>
            <Show
                when={showNotification && notification}
            >
                <NotificationAlert
                    type={notification?.type}
                    title="Profile Settings"
                    message={notification?.message}
                    onClose={() => {
                        setNotification(null)
                        setShowNotification(false);
                    }}
                />
            </Show>
        </Box>
    );
};

export default ProfileSettings;