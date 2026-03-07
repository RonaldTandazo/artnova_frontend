import { Box, Button, Card, CheckboxCard, Field, Flex, For, Heading, IconButton, Show, Stack } from "@chakra-ui/react";
import { IoIosSave } from "react-icons/io";
import { useEffect, useState } from "react";
import { ProfileSkillsInterestsProps } from "@/custom/interfaces/ProfileSettings/ProfileSkillsInterests";
import SearchableInput from "../Searchable/SearchableInput";
import { Notification, SelectOptions } from "@/custom/interfaces/general/GeneralInterfaces";
import { useGetUserSkills, useStoreUserSkills } from "@/services/UserSkills/UserSkillService";
import { useColorMode } from "@/components/ui/color-mode";
import LoadingProgress from "../States/LoadingProgress";

const ProfileSkillsInterests = ({skillsLoading, categories, topics, softwares, resetAlert, handleNotification}: ProfileSkillsInterestsProps) => {
    const { colorMode } = useColorMode();
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<SelectOptions[]>([]);
    const [selectedSoftware, setSelectedSoftware] = useState<SelectOptions[]>([]);
    const { getUserSkills, data: userSkillsData, loading: userSkillsLoading } = useGetUserSkills();
    const { storeUserSkills, error: storeUserSkillsError, loading: storeUserSkillsLoading } = useStoreUserSkills();

    useEffect(() => {
        getUserSkills();
    }, [])

    useEffect(() => {
        if(userSkillsData?.getUserSkills){
            const { userCategories, userSoftwares, userTopics } = userSkillsData.getUserSkills;
            
            if(userCategories && userCategories.length > 0){
                setSelectedCategories(userCategories.map(category => category.categoryId))
            }

            if(userSoftwares && userSoftwares.length > 0){
                setSelectedSoftware(userSoftwares.map(software => ({
                    value: software.softwareId,
                    label: software.name
                })));
            }

            if(userTopics && userTopics.length > 0){
                setSelectedTopic(userTopics.map(topic => ({
                    value: topic.topicId,
                    label: topic.name
                })));
            }
        }
    }, [userSkillsData]);

    useEffect(() => {
        if (storeUserSkillsError?.message) {
            const notification: Notification = {
                message: storeUserSkillsError?.message,
                type: "error"
            };
            handleNotification(notification);
        }
    
    }, [storeUserSkillsError]);

    const handleCategoryChange = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleTopicChange = (item: SelectOptions, action: string) => {
        if(action === "remove"){
            if (selectedTopic.find((topic) => item.value === topic.value)) {
                setSelectedTopic(selectedTopic.filter((topic) => item.value !== topic.value));
            }
        }

        if(action === "add"){
            if (!selectedTopic.find((topic) => item.value == topic.value)) {
                setSelectedTopic([...selectedTopic, item]);
            }
        }
    };

    const handleSoftwareChange = (item: SelectOptions, action: string) => {
        if(action === "remove"){
            if (selectedSoftware.find((software) => item.value === software.value)) {
                setSelectedSoftware(selectedSoftware.filter((software) => item.value !== software.value));
            }
        }

        if(action === "add"){
            if (!selectedSoftware.find((software) => item.value == software.value)) {
                setSelectedSoftware([...selectedSoftware, item]);
            }
        }
    };

    const onSubmitSkills = (async () => {
        resetAlert()
        
        const data = {
            categories: selectedCategories,
            topics: selectedTopic.map(topic => topic.value),
            softwares: selectedSoftware.map(software => software.value)
        }
        
        const response = await storeUserSkills(data);
        if(response?.data){
            const storeUserSkillsData = response?.data;
            const notification: Notification = {
                message: Object.values(storeUserSkillsData).find(value => value !== undefined),
                type: 'success'
            }
            handleNotification(notification)
        }
    });

    return (
        <Show
            when={!skillsLoading && !userSkillsLoading}
            fallback={
                <LoadingProgress/>
            }
        >

            <Stack p={7}>
                <Box w={"full"}>
                    <Box w={"full"} mb={3}>
                        <Heading size="3xl">Skills & Interests</Heading>
                    </Box>
                    <Box w={"full"} mb={10}>
                        <Heading size="lg">Share your skills & interests</Heading>
                    </Box>
                </Box>
                <Show 
                    when={categories.length > 0 && topics.length > 0 && softwares.length > 0}
                    fallback={
                        <label>
                            Ooops...Please try it later!
                        </label>
                    }
                >
                    <Stack gap={5}>
                        <Box w={"full"} marginBottom={"25px"}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Main Categories</Field.Label>
                            </Field.Root>
                            <Flex
                                gap={4}
                                display="grid"
                                gridTemplateColumns="repeat(4, 1fr)"
                                gridAutoRows="auto"
                                mt={3}
                            >
                                <For each={categories}>
                                    {(item) => (
                                        <CheckboxCard.Root
                                            key={item.value}
                                            variant={"outline"}
                                            colorPalette={colorMode === "light" ? "cyan" : "pink"}
                                            onCheckedChange={() => handleCategoryChange(Number(item.value))}
                                            checked={selectedCategories.includes(Number(item.value))}
                                            cursor="pointer"
                                        >
                                            <CheckboxCard.HiddenInput />
                                            <CheckboxCard.Control>
                                                <CheckboxCard.Label>{item.label}</CheckboxCard.Label>
                                                <CheckboxCard.Indicator />
                                            </CheckboxCard.Control>
                                        </CheckboxCard.Root>
                                    )}
                                </For>
                            </Flex>
                        </Box>

                        <Box w={"full"} marginBottom={"25px"}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Main Topics</Field.Label>
                                <SearchableInput options={topics} placeholder="Choose topics you domain" onSelect={handleTopicChange}/>
                            </Field.Root>
                            <Show
                                when={selectedTopic.length > 0}
                            >
                                <Flex
                                    gap={4}
                                    display="grid"
                                    gridTemplateColumns="repeat(4, 1fr)"
                                    gridAutoRows="auto"
                                    borderRadius={"sm"}
                                    p={5}
                                    mt={5}
                                    shadow={"inner"}
                                >
                                    <For each={selectedTopic}>
                                        {(item) => (
                                            <Card.Root size="sm" key={item.value} borderWidth={"2px"} borderColor={colorMode === "light" ? "cyan.600":"pink.600"}>
                                                <Card.Body display={"flex"} justifyContent={"center"}>
                                                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                                                        <Heading size="sm">{item.label}</Heading>
                                                        <IconButton
                                                            onClick={() => handleTopicChange(item, "remove")} 
                                                            size={"2xs"} 
                                                            bg={colorMode === "light" ? "cyan.600":"pink.600"}   
                                                            color={"white"} 
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                            fontSize={"sm"}
                                                            borderRadius={"sm"}
                                                        >
                                                            X
                                                        </IconButton>
                                                    </Flex>
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </Flex>
                            </Show>
                        </Box>

                        <Box w={"full"}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Main Softwares</Field.Label>
                                <SearchableInput options={softwares} placeholder="Choose softwares you domain" onSelect={handleSoftwareChange}/>
                            </Field.Root>
                            <Show
                                when={selectedSoftware.length > 0}
                            >
                                <Flex
                                    gap={4}
                                    display="grid"
                                    gridTemplateColumns="repeat(4, 1fr)"
                                    gridAutoRows="auto"
                                    borderRadius={"sm"}
                                    p={5}
                                    mt={5}
                                    shadow={"inner"}
                                >
                                    <For each={selectedSoftware}>
                                        {(item) => (
                                            <Card.Root size="sm" key={item.value} borderWidth={"2px"} borderColor={colorMode === "light" ? "cyan.600":"pink.600"}>
                                                <Card.Body display={"flex"} justifyContent={"center"}>
                                                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                                                        <Heading size="md">{item.label}</Heading>
                                                        <IconButton
                                                            onClick={() => handleSoftwareChange(item, "remove")} 
                                                            size={"2xs"} 
                                                            bg={colorMode === "light" ? "cyan.600":"pink.600"}   
                                                            color={"white"} 
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                            fontSize={"sm"}
                                                            borderRadius={"sm"}
                                                        >
                                                            X
                                                        </IconButton>
                                                    </Flex>
                                                </Card.Body>
                                            </Card.Root>
                                        )}
                                    </For>
                                </Flex>
                            </Show>
                        </Box>

                        <Button
                            alignSelf={"flex-end"} 
                            bg={colorMode === 'light' ? "cyan.600":"pink.600"} 
                            color={"white"}
                            loading={storeUserSkillsLoading}
                            disabled={storeUserSkillsLoading}
                            onClick={onSubmitSkills}
                        >
                            <IoIosSave />Save
                        </Button>
                    </Stack>
                </Show>
            </Stack>
        </Show>
    )
};

export default ProfileSkillsInterests;