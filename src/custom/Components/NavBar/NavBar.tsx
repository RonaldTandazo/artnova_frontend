import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { encodeToBase64 } from "@/utils/Helpers";
import { Avatar, Box, Button, Flex, HStack, Icon, Input, InputGroup, Menu, Portal, Show, Spacer, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingProgress from "../States/LoadingProgress";
import { GiAtomicSlashes } from "react-icons/gi";
import { FaBookBookmark, FaComments } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const NavBar = () => {
    const { colorMode } = useColorMode();
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleScroll = () => {
        if (window.scrollY > 10) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavigateRoutes = (module: string, route: string | null = module) => {
        if(user){
            const encodedUserId = encodeToBase64(user.userId);
            const encodedModule = encodeToBase64(module);
    
            navigate(`/${route}/${encodedUserId}/${encodedModule}`);
        }
    }

    const handleNavigate = () => {
        navigate("/")
    }

    let authButtons;
    if (loading) {
        authButtons = (
            <LoadingProgress />
        );
    }else if(!isAuthenticated && !user) {
        authButtons = (
            <>
                <Button
                    bg={"black"}
                    color={"white"}
                    onClick={() => navigate("/SignUp")}
                >
                    <BsPencilSquare /> Sign Up
                </Button>
                <Button
                    bg={"white"}
                    color={colorMode == "light" ? "cyan.600":"pink.600"}
                    onClick={() => navigate("/SignIn")}
                >
                    <BsFillPersonVcardFill /> Sign In
                </Button>
            </>
        );
    }else if(isAuthenticated && user){
        authButtons = (
            <>
                <Icon
                    color={"white"}
                    size={"lg"}
                    cursor={"pointer"}
                    onClick={() => handleNavigateRoutes('Favourites')}
                >
                    <FaBookBookmark />
                </Icon>

                <Icon
                    color={"white"}
                    size={"lg"}
                    cursor={"pointer"}
                    onClick={() => handleNavigateRoutes('Chats')}
                >
                    <FaComments />
                </Icon>

                <Menu.Root lazyMount>
                    <Menu.Trigger asChild>
                        <Button bg={"transparent"} color={"transparent"} borderRadius={"full"} width={"0px"}>
                            <Avatar.Root
                                key={"subtle"} 
                                variant={"subtle"}
                                cursor={"pointer"}
                            >
                                <Show
                                    when={user && user.avatar}
                                    fallback={
                                        <Avatar.Fallback name={user?.username} />
                                    }
                                >
                                    <Avatar.Image src={`${BACKEND_URL}/avatars/${user.avatar}`} />
                                </Show>
                            </Avatar.Root>
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content zIndex={"toast"}>
                                <Menu.ItemGroup>
                                    <Menu.Item 
                                        value="profile" 
                                        onClick={() => handleNavigateRoutes('OwnProfile', 'Profile')} 
                                        cursor={"pointer"}
                                    >
                                        <FaUser />
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item 
                                        value="edit-profile" 
                                        onClick={() => handleNavigateRoutes('OwnProfile', 'ProfileSettings')} 
                                        cursor={"pointer"}
                                    >
                                        <MdManageAccounts />
                                        Profile Settings
                                    </Menu.Item>
                                </Menu.ItemGroup>

                                <Menu.Separator />
                                
                                <Menu.ItemGroup>
                                    <Menu.Item 
                                        value="sign-out" 
                                        onClick={() => logout()} 
                                        cursor={"pointer"}
                                        color="fg.error"
                                        _hover={{ bg: "bg.error", color: "fg.error" }}
                                    >
                                        <CiLogout /> Sign Out
                                    </Menu.Item>
                                </Menu.ItemGroup>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </>
        )
    }

    return (
        <Box 
            as="nav" 
            bg={colorMode === "light" ? "cyan.600" : "pink.600"}
            position="sticky" 
            top="0" 
            p={5}
            zIndex="sticky" 
            shadow={isScrolled ? "md" : "none"}
            transition="box-shadow 0.3s ease"
        >
            <HStack 
                align="center" 
                justifyContent="space-between"
            >
                <Flex 
                    w={"20%"}
                >
                    <HStack
                        cursor="pointer"
                        gap={3}
                        onClick={handleNavigate}
                    >
                        <Icon as={GiAtomicSlashes} color="whiteAlpha.950" boxSize={8}/>
                        <Text color="white" fontWeight="bold" fontSize={"xl"}>
                            ArtNova
                        </Text>
                    </HStack>
                </Flex>

                <Flex 
                    flex="1" 
                    w={"60%"} 
                >
                    <InputGroup 
                        flex="1" 
                        startElement={
                            <Icon color={"whiteAlpha.950"}>
                                <BsSearch />
                            </Icon>
                        }
                        color={"whiteAlpha.950"}
                    >
                        <Input 
                            placeholder="What are you looking for?..."
                            _placeholder={{ color: "whiteAlpha.950" }} 
                            borderRadius="full" 
                            size="lg" 
                            borderColor={"whiteAlpha.950"}
                        />
                    </InputGroup>
                </Flex>

                <Flex
                    width={"20%"}
                    alignItems={"center"}
                    gap={5}
                >
                    <Spacer />
                    {authButtons}
                </Flex>
            </HStack>
        </Box>
    )
}

export default NavBar