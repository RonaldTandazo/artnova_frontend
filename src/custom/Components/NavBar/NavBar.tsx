import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { encodeToBase64 } from "@/utils/Helpers";
import { Box, Button, Flex, HStack, Icon, Input, InputGroup, Spacer, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import LoadingProgress from "../States/LoadingProgress";
import { GiAtomicSlashes } from "react-icons/gi";
import { FaBookBookmark, FaComments } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import NotificationTrigger from "./NotificationTrigger";
import AccountTrigger from "./AccountTrigger";

const NavBar = () => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

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

            const safeUserId = encodeURIComponent(encodedUserId);
            const safeModule = encodeURIComponent(encodedModule);
    
            navigate(`/${route}/${safeUserId}/${safeModule}`);
        }
    }

    const handleNavigate = () => {
        navigate("/")
    }

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/Search?s=${encodeURIComponent(searchQuery)}`);
        }
    };

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
                    color={colorMode == "light" ? "teal.400":"pink.600"}
                    onClick={() => navigate("/SignIn")}
                >
                    <BsFillPersonVcardFill /> Sign In
                </Button>
            </>
        );
    }else if(isAuthenticated && user){
        authButtons = (
            <>
                <Tooltip
                    content={`Favorites`}
                    openDelay={200}
                    closeDelay={100}
                    unmountOnExit={true}    
                    lazyMount={true}
                    positioning={{ placement: "left" }}
                    showArrow
                    contentProps={{ 
                        css: { 
                            "--tooltip-bg": colorMode === "light" ? "white":"black",
                            "color": colorMode === "light" ? "black":"white"
                        }
                    }}
                >
                    <Icon
                        color={"white"}
                        size={"lg"}
                        cursor={"pointer"}
                        onClick={() => handleNavigateRoutes('Favorites')}
                    >
                        <FaBookBookmark />
                    </Icon>
                </Tooltip>

                <NotificationTrigger
                    user={user}
                />

                <Tooltip
                    content={`Chats`}
                    openDelay={200}
                    closeDelay={100}
                    unmountOnExit={true}    
                    lazyMount={true}
                    positioning={{ placement: "left" }}
                    showArrow
                    contentProps={{ 
                        css: { 
                            "--tooltip-bg": colorMode === "light" ? "white":"black",
                            "color": colorMode === "light" ? "black":"white"
                        }
                    }}
                >
                    <Icon
                        color={"white"}
                        size={"lg"}
                        cursor={"pointer"}
                        onClick={() => handleNavigateRoutes('Chats')}
                    >
                        <FaComments />
                    </Icon>
                </Tooltip>

                <AccountTrigger 
                    user={user}
                    logout={logout}
                    navigateTo={(module, route) => handleNavigateRoutes(module, route)}
                />
            </>
        )
    }

    return (
        <Box 
            as="nav" 
            bg={colorMode === "light" ? "teal.400" : "pink.600"}
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
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